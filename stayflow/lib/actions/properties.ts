'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property';

export async function createProperty(data: PropertyFormValues) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Validate the input
  const validatedFields = propertySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Get current user for debugging
  const { data: { user } } = await supabase.auth.getUser();

  console.log('DEBUG: Current user ID:', user?.id);
  console.log('DEBUG: Attempting to insert property with organization_id:', organization.id);
  console.log('DEBUG: Check if this user_id is a member of this organization_id in organization_members table');

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      organization_id: organization.id,
      name: validatedFields.data.name,
      type: validatedFields.data.type,
      capacity: validatedFields.data.capacity,
      price_per_night: validatedFields.data.price_per_night,
      amenities: validatedFields.data.amenities,
      status: validatedFields.data.status,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    // Provide user-friendly error messages
    if (error.code === '42501') {
      return { error: 'Permission denied. Please ensure you have the necessary permissions to create properties.' };
    }

    return { error: error.message || 'Failed to create property' };
  }

  revalidatePath('/properties');
  redirect('/properties');
}

export async function updateProperty(id: string, data: PropertyFormValues) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Validate the input
  const validatedFields = propertySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: property, error } = await supabase
    .from('properties')
    .update({
      name: validatedFields.data.name,
      type: validatedFields.data.type,
      capacity: validatedFields.data.capacity,
      price_per_night: validatedFields.data.price_per_night,
      amenities: validatedFields.data.amenities,
      status: validatedFields.data.status,
    })
    .eq('id', id)
    .eq('organization_id', organization.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    return { error: error.message || 'Failed to update property' };
  }

  revalidatePath('/properties');
  redirect('/properties');
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Check for existing bookings
  const { count, error: countError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId);

  if (countError) {
    console.error('Error checking bookings:', countError);
    return { error: 'Failed to verify property status' };
  }

  if (count && count > 0) {
    return { error: 'Cannot delete property with existing bookings' };
  }

  // Delete the property (organization_id check is handled by RLS)
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('organization_id', organization.id);

  if (error) {
    console.error('Error deleting property:', error);
    return { error: 'Failed to delete property' };
  }

  revalidatePath('/properties');
  return { success: true };
}
