'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/services/organizations';
import type { CreateMessageTemplateData, UpdateMessageTemplateData } from '@/lib/types/message';

export async function createTemplate(data: CreateMessageTemplateData) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { error: 'No organization found' };
    }

    // Validate inputs
    if (!data.title || data.title.trim().length === 0) {
      return { error: 'Title is required' };
    }

    if (!data.recipient) {
      return { error: 'Recipient is required' };
    }

    if (!data.template || data.template.trim().length === 0) {
      return { error: 'Template content is required' };
    }

    // Insert template
    const { data: template, error } = await supabase
      .from('message_templates')
      .insert({
        organization_id: organization.id,
        title: data.title.trim(),
        recipient: data.recipient,
        template: data.template.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return { error: 'Failed to create template' };
    }

    revalidatePath('/messages');
    return { success: true, data: template };
  } catch (error) {
    console.error('Error creating template:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateTemplate(id: string, data: UpdateMessageTemplateData) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { error: 'No organization found' };
    }

    // Validate inputs
    const updateData: any = {};

    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        return { error: 'Title cannot be empty' };
      }
      updateData.title = data.title.trim();
    }

    if (data.recipient !== undefined) {
      updateData.recipient = data.recipient;
    }

    if (data.template !== undefined) {
      if (data.template.trim().length === 0) {
        return { error: 'Template content cannot be empty' };
      }
      updateData.template = data.template.trim();
    }

    updateData.updated_at = new Date().toISOString();

    // Update template
    const { data: template, error } = await supabase
      .from('message_templates')
      .update(updateData)
      .eq('id', id)
      .eq('organization_id', organization.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return { error: 'Failed to update template' };
    }

    revalidatePath('/messages');
    revalidatePath(`/messages/${id}/edit`);
    return { success: true, data: template };
  } catch (error) {
    console.error('Error updating template:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteTemplate(id: string) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { error: 'No organization found' };
    }

    const { error } = await supabase
      .from('message_templates')
      .delete()
      .eq('id', id)
      .eq('organization_id', organization.id);

    if (error) {
      console.error('Error deleting template:', error);
      return { error: 'Failed to delete template' };
    }

    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    console.error('Error deleting template:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getTemplate(id: string) {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { error: 'No organization found' };
    }

    const { data: template, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organization.id)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return { error: 'Template not found' };
    }

    return { success: true, data: template };
  } catch (error) {
    console.error('Error fetching template:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getTemplates() {
  try {
    const supabase = await createClient();
    const organization = await getCurrentOrganization(supabase);

    if (!organization) {
      return { error: 'No organization found' };
    }

    const { data: templates, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return { error: 'Failed to fetch templates' };
    }

    return { success: true, data: templates };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return { error: 'An unexpected error occurred' };
  }
}
