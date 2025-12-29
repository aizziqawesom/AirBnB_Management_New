-- Create organization_email_settings table for email configuration
CREATE TABLE IF NOT EXISTS organization_email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Email configuration
  sender_name TEXT DEFAULT 'StayFlow',
  reply_to_email TEXT,
  email_signature TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one settings row per organization
  UNIQUE(organization_id)
);

-- Enable RLS
ALTER TABLE organization_email_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view email settings in their organization
CREATE POLICY "Users can view email settings in their organization"
  ON organization_email_settings
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update email settings in their organization
CREATE POLICY "Users can update email settings in their organization"
  ON organization_email_settings
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert email settings in their organization
CREATE POLICY "Users can insert email settings in their organization"
  ON organization_email_settings
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_organization_email_settings_updated_at
  BEFORE UPDATE ON organization_email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_organization_email_settings_organization_id
  ON organization_email_settings(organization_id);
