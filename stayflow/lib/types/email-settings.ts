// Email settings type definitions for organization-level email configuration

export interface EmailSettings {
  id: string;
  organization_id: string;
  sender_name: string;
  reply_to_email: string | null;
  email_signature: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateEmailSettingsData {
  sender_name?: string;
  reply_to_email?: string | null;
  email_signature?: string | null;
}
