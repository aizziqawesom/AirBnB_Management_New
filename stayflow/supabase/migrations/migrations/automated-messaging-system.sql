-- Automated Messaging System Migration
-- This migration adds support for automated email messaging with triggers and history tracking

-- ============================================================================
-- 1. Add guest_email to bookings table
-- ============================================================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_email TEXT;
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);

-- ============================================================================
-- 2. Create message_triggers table
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES message_templates(id) ON DELETE CASCADE,

  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('event', 'time_based')),

  -- Event-based fields
  event_type TEXT CHECK (event_type IN (
    'booking_created', 'booking_confirmed', 'booking_cancelled',
    'booking_checked_in', 'booking_checked_out', 'booking_completed', 'booking_no_show'
  )),

  -- Time-based fields
  time_offset_value INTEGER,
  time_offset_unit TEXT CHECK (time_offset_unit IN ('hours', 'days')),
  time_reference TEXT CHECK (time_reference IN (
    'before_checkin', 'after_checkin', 'before_checkout', 'after_checkout'
  )),
  send_time TIME,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for message_triggers
CREATE INDEX IF NOT EXISTS idx_message_triggers_org_id ON message_triggers(organization_id);
CREATE INDEX IF NOT EXISTS idx_message_triggers_template_id ON message_triggers(template_id);
CREATE INDEX IF NOT EXISTS idx_message_triggers_type ON message_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_message_triggers_event_type ON message_triggers(event_type);
CREATE INDEX IF NOT EXISTS idx_message_triggers_active ON message_triggers(is_active);

-- ============================================================================
-- 3. Create trigger_property_assignments table
-- ============================================================================
CREATE TABLE IF NOT EXISTS trigger_property_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id UUID NOT NULL REFERENCES message_triggers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trigger_id, property_id)
);

-- Indexes for trigger_property_assignments
CREATE INDEX IF NOT EXISTS idx_trigger_property_trigger_id ON trigger_property_assignments(trigger_id);
CREATE INDEX IF NOT EXISTS idx_trigger_property_property_id ON trigger_property_assignments(property_id);

-- ============================================================================
-- 4. Create sent_messages table
-- ============================================================================
CREATE TABLE IF NOT EXISTS sent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES message_triggers(id) ON DELETE SET NULL,
  template_id UUID REFERENCES message_templates(id) ON DELETE SET NULL,

  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,

  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'bounced')) DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,

  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sent_messages
CREATE INDEX IF NOT EXISTS idx_sent_messages_org_id ON sent_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_sent_messages_booking_id ON sent_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_sent_messages_trigger_id ON sent_messages(trigger_id);
CREATE INDEX IF NOT EXISTS idx_sent_messages_status ON sent_messages(status);
CREATE INDEX IF NOT EXISTS idx_sent_messages_created_at ON sent_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_messages_recipient_email ON sent_messages(recipient_email);

-- ============================================================================
-- 5. Create message_idempotency table
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  trigger_id UUID NOT NULL REFERENCES message_triggers(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE,
  sent_message_id UUID REFERENCES sent_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, trigger_id)
);

-- Indexes for message_idempotency
CREATE INDEX IF NOT EXISTS idx_message_idempotency_key ON message_idempotency(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_message_idempotency_booking_trigger ON message_idempotency(booking_id, trigger_id);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE message_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_property_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_idempotency ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for message_triggers
-- ============================================================================

-- SELECT: Users can view triggers in their organization
CREATE POLICY "Users can view triggers in their organization"
  ON message_triggers
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Users can create triggers in their organization
CREATE POLICY "Users can create triggers in their organization"
  ON message_triggers
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- UPDATE: Users can update triggers in their organization
CREATE POLICY "Users can update triggers in their organization"
  ON message_triggers
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: Users can delete triggers in their organization
CREATE POLICY "Users can delete triggers in their organization"
  ON message_triggers
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS Policies for trigger_property_assignments
-- ============================================================================

-- SELECT: Users can view assignments for triggers in their organization
CREATE POLICY "Users can view trigger property assignments"
  ON trigger_property_assignments
  FOR SELECT
  USING (
    trigger_id IN (
      SELECT id
      FROM message_triggers
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- INSERT: Users can create assignments for triggers in their organization
CREATE POLICY "Users can create trigger property assignments"
  ON trigger_property_assignments
  FOR INSERT
  WITH CHECK (
    trigger_id IN (
      SELECT id
      FROM message_triggers
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- DELETE: Users can delete assignments for triggers in their organization
CREATE POLICY "Users can delete trigger property assignments"
  ON trigger_property_assignments
  FOR DELETE
  USING (
    trigger_id IN (
      SELECT id
      FROM message_triggers
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- RLS Policies for sent_messages
-- ============================================================================

-- SELECT: Users can view sent messages in their organization
CREATE POLICY "Users can view sent messages in their organization"
  ON sent_messages
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Service role can insert sent messages (used by server actions)
CREATE POLICY "Service can insert sent messages"
  ON sent_messages
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: Service role can update sent messages (used for status updates)
CREATE POLICY "Service can update sent messages"
  ON sent_messages
  FOR UPDATE
  USING (true);

-- ============================================================================
-- RLS Policies for message_idempotency
-- ============================================================================

-- SELECT: Service role can check idempotency
CREATE POLICY "Service can check idempotency"
  ON message_idempotency
  FOR SELECT
  USING (true);

-- INSERT: Service role can insert idempotency records
CREATE POLICY "Service can insert idempotency records"
  ON message_idempotency
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- Create updated_at trigger function (if not exists)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_message_triggers_updated_at ON message_triggers;
CREATE TRIGGER update_message_triggers_updated_at
  BEFORE UPDATE ON message_triggers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sent_messages_updated_at ON sent_messages;
CREATE TRIGGER update_sent_messages_updated_at
  BEFORE UPDATE ON sent_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
