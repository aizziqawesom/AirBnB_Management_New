// Email settings service for organization-level email configuration

import { createClient } from '@/lib/supabase/server';
import type { EmailSettings, UpdateEmailSettingsData } from '@/lib/types/email-settings';

/**
 * Get email settings for the current organization
 * Creates default settings if none exist
 */
export async function getEmailSettings(): Promise<EmailSettings | null> {
  const supabase = await createClient();

  // Get current user's organization
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) return null;

  // Try to get existing settings
  const { data: settings } = await supabase
    .from('organization_email_settings')
    .select('*')
    .eq('organization_id', membership.organization_id)
    .single();

  if (settings) {
    return settings;
  }

  // Create default settings if none exist
  const { data: newSettings, error } = await supabase
    .from('organization_email_settings')
    .insert({
      organization_id: membership.organization_id,
      sender_name: 'StayFlow',
      reply_to_email: null,
      email_signature: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating default email settings:', error);
    return null;
  }

  return newSettings;
}

/**
 * Update email settings for the current organization
 */
export async function updateEmailSettings(
  data: UpdateEmailSettingsData
): Promise<EmailSettings | null> {
  const supabase = await createClient();

  // Get current user's organization
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) return null;

  // Ensure settings exist first
  await getEmailSettings();

  // Update settings
  const { data: updatedSettings, error } = await supabase
    .from('organization_email_settings')
    .update(data)
    .eq('organization_id', membership.organization_id)
    .select()
    .single();

  if (error) {
    console.error('Error updating email settings:', error);
    throw error;
  }

  return updatedSettings;
}
