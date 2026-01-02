'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentOrganization } from '@/lib/utils/organization';
import { triggerSchema } from '@/lib/validations/trigger';
import type { CreateTriggerData } from '@/lib/types/trigger';

export async function createTrigger(formData: CreateTriggerData) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { success: false, error: 'No organization found' };
    }

    // Validate input
    const validationResult = triggerSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || 'Validation failed',
      };
    }

    const data = validationResult.data;

    // Use admin client to bypass RLS for insert
    const adminClient = createAdminClient();

    // Prepare trigger data based on type
    const triggerData: Record<string, unknown> = {
      organization_id: organization.id,
      name: data.name,
      template_id: data.template_id,
      trigger_type: data.trigger_type,
      is_active: true,
      email_enabled: (data as any).email_enabled ?? true,
      whatsapp_enabled: (data as any).whatsapp_enabled ?? false,
    };

    if (data.trigger_type === 'event') {
      triggerData.event_type = data.event_type;
    } else {
      // time_based
      triggerData.time_offset_value = data.time_offset_value;
      triggerData.time_offset_unit = data.time_offset_unit;
      triggerData.time_reference = data.time_reference;
      // Convert HH:MM to HH:MM:SS for database
      triggerData.send_time = `${data.send_time}:00`;
    }

    // Create the trigger
    const { data: trigger, error: triggerError } = await adminClient
      .from('message_triggers')
      .insert(triggerData)
      .select()
      .single();

    if (triggerError || !trigger) {
      console.error('Error creating trigger:', triggerError);
      return { success: false, error: 'Failed to create trigger' };
    }

    // Add property assignments if provided
    if (data.property_ids && data.property_ids.length > 0) {
      const assignments = data.property_ids.map((propertyId) => ({
        trigger_id: trigger.id,
        property_id: propertyId,
      }));

      const { error: assignmentsError } = await adminClient
        .from('trigger_property_assignments')
        .insert(assignments);

      if (assignmentsError) {
        console.error('Error creating property assignments:', assignmentsError);
        // Don't fail the whole operation, just log the error
      }
    }

    revalidatePath('/messages/triggers');
    return { success: true, data: trigger };
  } catch (error) {
    console.error('Unexpected error creating trigger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateTrigger(
  id: string,
  updates: {
    is_active?: boolean;
    property_ids?: string[];
  }
) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { success: false, error: 'No organization found' };
    }

    const adminClient = createAdminClient();

    // Verify trigger belongs to organization
    const { data: existingTrigger } = await adminClient
      .from('message_triggers')
      .select('id, organization_id')
      .eq('id', id)
      .single();

    if (!existingTrigger || existingTrigger.organization_id !== organization.id) {
      return { success: false, error: 'Trigger not found' };
    }

    // Update trigger if is_active is provided
    if (updates.is_active !== undefined) {
      const { error: updateError } = await adminClient
        .from('message_triggers')
        .update({ is_active: updates.is_active })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating trigger:', updateError);
        return { success: false, error: 'Failed to update trigger' };
      }
    }

    // Update property assignments if provided
    if (updates.property_ids !== undefined) {
      // Delete existing assignments
      await adminClient
        .from('trigger_property_assignments')
        .delete()
        .eq('trigger_id', id);

      // Insert new assignments
      if (updates.property_ids.length > 0) {
        const assignments = updates.property_ids.map((propertyId) => ({
          trigger_id: id,
          property_id: propertyId,
        }));

        const { error: assignmentsError } = await adminClient
          .from('trigger_property_assignments')
          .insert(assignments);

        if (assignmentsError) {
          console.error('Error updating property assignments:', assignmentsError);
          return { success: false, error: 'Failed to update property assignments' };
        }
      }
    }

    revalidatePath('/messages/triggers');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating trigger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteTrigger(id: string) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { success: false, error: 'No organization found' };
    }

    const adminClient = createAdminClient();

    // Verify trigger belongs to organization
    const { data: existingTrigger } = await adminClient
      .from('message_triggers')
      .select('id, organization_id')
      .eq('id', id)
      .single();

    if (!existingTrigger || existingTrigger.organization_id !== organization.id) {
      return { success: false, error: 'Trigger not found' };
    }

    // Delete trigger (CASCADE will handle property assignments)
    const { error: deleteError } = await adminClient
      .from('message_triggers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting trigger:', deleteError);
      return { success: false, error: 'Failed to delete trigger' };
    }

    revalidatePath('/messages/triggers');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting trigger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function toggleTrigger(id: string, isActive: boolean) {
  return updateTrigger(id, { is_active: isActive });
}

export async function getTriggerById(triggerId: string) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return null;
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('message_triggers')
      .select(`
        *,
        message_templates (
          id,
          title
        ),
        trigger_property_assignments (
          property_id
        )
      `)
      .eq('id', triggerId)
      .eq('organization_id', organization.id)
      .single();

    if (error) {
      console.error('Error fetching trigger:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching trigger:', error);
    return null;
  }
}

export async function updateTriggerFull(
  triggerId: string,
  data: Partial<{
    name: string;
    template_id: string;
    email_enabled: boolean;
    whatsapp_enabled: boolean;
    is_active: boolean;
    event_type: string;
    time_offset_value: number;
    time_offset_unit: string;
    time_reference: string;
    send_time: string;
  }>,
  propertyIds: string[]
) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { success: false, error: 'No organization found' };
    }

    const adminClient = createAdminClient();

    // Verify trigger belongs to organization
    const { data: existingTrigger } = await adminClient
      .from('message_triggers')
      .select('id, organization_id')
      .eq('id', triggerId)
      .single();

    if (!existingTrigger || existingTrigger.organization_id !== organization.id) {
      return { success: false, error: 'Trigger not found' };
    }

    // Update trigger
    const { error: updateError } = await adminClient
      .from('message_triggers')
      .update(data)
      .eq('id', triggerId);

    if (updateError) {
      console.error('Error updating trigger:', updateError);
      return { success: false, error: updateError.message };
    }

    // Update property assignments
    // First delete existing assignments
    await adminClient
      .from('trigger_property_assignments')
      .delete()
      .eq('trigger_id', triggerId);

    // Then insert new ones if provided
    if (propertyIds.length > 0) {
      const assignments = propertyIds.map(propertyId => ({
        trigger_id: triggerId,
        property_id: propertyId,
      }));

      await adminClient
        .from('trigger_property_assignments')
        .insert(assignments);
    }

    revalidatePath('/messages/triggers');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating trigger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
