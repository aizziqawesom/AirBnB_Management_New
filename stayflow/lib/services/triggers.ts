import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import type { TriggerWithDetails } from '@/lib/types/trigger';

/**
 * Get all triggers for the current organization with details
 * @returns Array of triggers with template and property details
 */
export async function getTriggers(): Promise<TriggerWithDetails[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  const { data, error } = await supabase
    .from('message_triggers')
    .select(
      `
      *,
      trigger_property_assignments (
        property_id,
        properties!trigger_property_assignments_property_id_fkey (
          id,
          name
        )
      )
    `
    )
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching triggers:', error);
    throw error;
  }

  // Get unique template IDs
  const templateIds = [...new Set(data?.map(t => t.template_id).filter(Boolean) || [])];

  // Fetch all templates in one query
  const { data: templates } = await supabase
    .from('message_templates')
    .select('id, title, template, recipient')
    .in('id', templateIds);

  const templatesMap = new Map(templates?.map(t => [t.id, t]) || []);

  // Transform the data to match our interface
  return (data || []).map((trigger) => {
    const templateData = trigger.template_id ? templatesMap.get(trigger.template_id) : null;

    const template = templateData
      ? {
          id: templateData.id,
          name: templateData.title,
          message_content: templateData.template,
          recipient_type: templateData.recipient as 'guest' | 'cleaner' | 'owner',
        }
      : undefined;

    const properties = trigger.trigger_property_assignments
      ? trigger.trigger_property_assignments
          .map((assignment: { properties: { id: string; name: string } | null }) =>
            assignment.properties ? {
              id: assignment.properties.id,
              name: assignment.properties.name,
            } : null
          )
          .filter(Boolean)
      : [];

    return {
      ...trigger,
      template,
      properties,
    } as TriggerWithDetails;
  });
}

/**
 * Get a single trigger by ID with details
 * @param id - UUID of the trigger
 * @returns Trigger with template and property details, or null if not found
 */
export async function getTrigger(
  id: string
): Promise<TriggerWithDetails | null> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return null;
  }

  const { data, error } = await supabase
    .from('message_triggers')
    .select(
      `
      *,
      trigger_property_assignments (
        property_id,
        properties!trigger_property_assignments_property_id_fkey (
          id,
          name
        )
      )
    `
    )
    .eq('id', id)
    .eq('organization_id', organization.id)
    .single();

  if (error || !data) {
    return null;
  }

  // Fetch template data if available
  let template = undefined;
  if (data.template_id) {
    const { data: templateData } = await supabase
      .from('message_templates')
      .select('id, title, template, recipient')
      .eq('id', data.template_id)
      .single();

    if (templateData) {
      template = {
        id: templateData.id,
        name: templateData.title,
        message_content: templateData.template,
        recipient_type: templateData.recipient as 'guest' | 'cleaner' | 'owner',
      };
    }
  }

  const properties = data.trigger_property_assignments
    ? data.trigger_property_assignments
        .map((assignment: { properties: { id: string; name: string } | null }) =>
          assignment.properties ? {
            id: assignment.properties.id,
            name: assignment.properties.name,
          } : null
        )
        .filter(Boolean)
    : [];

  return {
    ...data,
    template,
    properties,
  } as TriggerWithDetails;
}

/**
 * Get triggers filtered by property
 * @param propertyId - UUID of the property
 * @returns Array of triggers applicable to this property
 */
export async function getTriggersByProperty(
  propertyId: string
): Promise<TriggerWithDetails[]> {
  const allTriggers = await getTriggers();

  // Return triggers that either have no property assignments (apply to all)
  // or have this property in their assignments
  return allTriggers.filter((trigger) => {
    if (!trigger.properties || trigger.properties.length === 0) {
      return true; // No assignments = applies to all properties
    }

    return trigger.properties.some((prop) => prop.id === propertyId);
  });
}

/**
 * Get triggers filtered by template
 * @param templateId - UUID of the template
 * @returns Array of triggers using this template
 */
export async function getTriggersByTemplate(
  templateId: string
): Promise<TriggerWithDetails[]> {
  const allTriggers = await getTriggers();
  return allTriggers.filter((trigger) => trigger.template_id === templateId);
}

/**
 * Count active triggers for the current organization
 * @returns Count of active triggers
 */
export async function getActiveTriggerCount(): Promise<number> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return 0;
  }

  const { count, error } = await supabase
    .from('message_triggers')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organization.id)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting active triggers:', error);
    return 0;
  }

  return count || 0;
}
