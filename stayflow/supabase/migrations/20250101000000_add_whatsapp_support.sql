-- Add WhatsApp support to the messaging system
-- This migration adds fields for multi-channel messaging (Email + WhatsApp)

-- Add phone number to bookings table for WhatsApp messaging
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(20);

-- Add channels array to message_triggers to support multi-channel selection
-- Default to email for existing triggers
ALTER TABLE message_triggers ADD COLUMN IF NOT EXISTS channels TEXT[] DEFAULT ARRAY['email']::TEXT[];

-- Add channel tracking to sent_messages
ALTER TABLE sent_messages ADD COLUMN IF NOT EXISTS channel VARCHAR(20) DEFAULT 'email';

-- Add WhatsApp-specific fields to sent_messages
ALTER TABLE sent_messages ADD COLUMN IF NOT EXISTS whatsapp_message_id VARCHAR(255);
ALTER TABLE sent_messages ADD COLUMN IF NOT EXISTS whatsapp_status VARCHAR(50);

-- Create index on channel for faster queries
CREATE INDEX IF NOT EXISTS idx_sent_messages_channel ON sent_messages(channel);

-- Create index on whatsapp_message_id for status lookups
CREATE INDEX IF NOT EXISTS idx_sent_messages_whatsapp_message_id ON sent_messages(whatsapp_message_id);
