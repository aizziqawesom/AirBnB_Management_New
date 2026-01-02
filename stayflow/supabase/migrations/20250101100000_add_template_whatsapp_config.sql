-- Add WhatsApp template configuration to message_templates
ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS whatsapp_template_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS whatsapp_language_code VARCHAR(10) DEFAULT 'en_US',
  ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;

-- Add individual channel toggles to message_triggers (replace channels array)
ALTER TABLE message_triggers
  ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN message_templates.whatsapp_template_name IS 'Meta Business Suite template name (e.g., booking_confirmation)';
COMMENT ON COLUMN message_templates.whatsapp_language_code IS 'Language code for WhatsApp template (e.g., en_US, ms_MY)';
COMMENT ON COLUMN message_templates.whatsapp_enabled IS 'Whether WhatsApp is enabled for this template';
COMMENT ON COLUMN message_triggers.email_enabled IS 'Whether email is enabled for this trigger';
COMMENT ON COLUMN message_triggers.whatsapp_enabled IS 'Whether WhatsApp is enabled for this trigger';

-- Note: Keep existing 'channels' column for backwards compatibility during migration
-- Can be removed later after data migration
