'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import { bookingSchema, type BookingFormValues } from '@/lib/validations/booking';
import type { BookingStatus } from '@/lib/types/booking';
import { triggerEventBasedMessages } from '@/lib/services/trigger-handler';

export async function createBooking(data: BookingFormValues) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Validate the input
  const validatedFields = bookingSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Check for booking conflicts
  // Two bookings overlap if: (new_start < existing_end) AND (new_end > existing_start)
  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id')
    .eq('property_id', validatedFields.data.property_id)
    .neq('status', 'cancelled')
    .lt('check_in', validatedFields.data.check_out)
    .gt('check_out', validatedFields.data.check_in);

  if (conflictError) {
    console.error('Error checking booking conflicts:', conflictError);
    return { error: 'Failed to verify availability' };
  }

  if (conflicts && conflicts.length > 0) {
    return { error: 'Property is already booked for the selected dates' };
  }

  // Verify property capacity
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('capacity')
    .eq('id', validatedFields.data.property_id)
    .single();

  if (propertyError) {
    console.error('Error fetching property:', propertyError);
    return { error: 'Failed to verify property details' };
  }

  if (property && validatedFields.data.guests > property.capacity) {
    return { error: `Number of guests exceeds property capacity (${property.capacity})` };
  }

  // Create the booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      organization_id: organization.id,
      property_id: validatedFields.data.property_id,
      guest_name: validatedFields.data.guest_name,
      phone: validatedFields.data.phone,
      guest_email: validatedFields.data.guest_email || null,
      check_in: validatedFields.data.check_in,
      check_out: validatedFields.data.check_out,
      guests: validatedFields.data.guests,
      price: validatedFields.data.price,
      source: validatedFields.data.source,
      notes: validatedFields.data.notes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return { error: error.message || 'Failed to create booking' };
  }

  // Trigger event-based messages for booking creation
  if (booking?.id) {
    triggerEventBasedMessages(booking.id, 'pending').catch((error) => {
      console.error('Failed to trigger messages for new booking:', error);
    });
  }

  revalidatePath('/bookings');
  redirect('/bookings');
}

export async function updateBooking(id: string, data: BookingFormValues) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Validate the input
  const validatedFields = bookingSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Check for booking conflicts (excluding current booking)
  // Two bookings overlap if: (new_start < existing_end) AND (new_end > existing_start)
  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id')
    .eq('property_id', validatedFields.data.property_id)
    .neq('id', id)
    .neq('status', 'cancelled')
    .lt('check_in', validatedFields.data.check_out)
    .gt('check_out', validatedFields.data.check_in);

  if (conflictError) {
    console.error('Error checking booking conflicts:', conflictError);
    return { error: 'Failed to verify availability' };
  }

  if (conflicts && conflicts.length > 0) {
    return { error: 'Property is already booked for the selected dates' };
  }

  // Verify property capacity
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('capacity')
    .eq('id', validatedFields.data.property_id)
    .single();

  if (propertyError) {
    console.error('Error fetching property:', propertyError);
    return { error: 'Failed to verify property details' };
  }

  if (property && validatedFields.data.guests > property.capacity) {
    return { error: `Number of guests exceeds property capacity (${property.capacity})` };
  }

  // Update the booking
  const { error } = await supabase
    .from('bookings')
    .update({
      property_id: validatedFields.data.property_id,
      guest_name: validatedFields.data.guest_name,
      phone: validatedFields.data.phone,
      guest_email: validatedFields.data.guest_email || null,
      check_in: validatedFields.data.check_in,
      check_out: validatedFields.data.check_out,
      guests: validatedFields.data.guests,
      price: validatedFields.data.price,
      source: validatedFields.data.source,
      notes: validatedFields.data.notes || null,
    })
    .eq('id', id)
    .eq('organization_id', organization.id);

  if (error) {
    console.error('Error updating booking:', error);
    return { error: error.message || 'Failed to update booking' };
  }

  revalidatePath('/bookings');
  revalidatePath(`/bookings/${id}`);
  redirect('/bookings');
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  // Get current booking to check if status is changing
  const { data: currentBooking } = await supabase
    .from('bookings')
    .select('status')
    .eq('id', id)
    .eq('organization_id', organization.id)
    .single();

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .eq('organization_id', organization.id);

  if (error) {
    console.error('Error updating booking status:', error);
    return { error: 'Failed to update booking status' };
  }

  // Trigger event-based messages if status changed
  if (currentBooking && currentBooking.status !== status) {
    triggerEventBasedMessages(id, status).catch((error) => {
      console.error('Failed to trigger messages for status change:', error);
    });
  }

  revalidatePath('/bookings');
  revalidatePath(`/bookings/${id}`);
  return { success: true };
}

export async function deleteBooking(bookingId: string) {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { error: 'No organization found' };
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('organization_id', organization.id);

  if (error) {
    console.error('Error deleting booking:', error);
    return { error: 'Failed to delete booking' };
  }

  revalidatePath('/bookings');
  return { success: true };
}
