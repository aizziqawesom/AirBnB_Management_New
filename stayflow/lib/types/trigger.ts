// Trigger type definitions for automated messaging system

export type TriggerType = 'event' | 'time_based';

export type EventType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_checked_in'
  | 'booking_checked_out'
  | 'booking_completed'
  | 'booking_no_show';

export type TimeOffsetUnit = 'hours' | 'days';

export type TimeReference =
  | 'before_checkin'
  | 'after_checkin'
  | 'before_checkout'
  | 'after_checkout';

export interface MessageTrigger {
  id: string;
  organization_id: string;
  name: string;
  template_id: string;
  trigger_type: TriggerType;

  // Event-based fields
  event_type?: EventType | null;

  // Time-based fields
  time_offset_value?: number | null;
  time_offset_unit?: TimeOffsetUnit | null;
  time_reference?: TimeReference | null;
  send_time?: string | null; // HH:MM:SS format

  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriggerWithDetails extends MessageTrigger {
  template?: {
    id: string;
    name: string;
    message_content: string;
    recipient_type: 'guest' | 'cleaner' | 'owner';
  };
  properties?: {
    id: string;
    name: string;
  }[];
}

// Form data types for creating/updating triggers
export interface CreateEventTriggerData {
  trigger_type: 'event';
  name: string;
  template_id: string;
  event_type: EventType;
  property_ids?: string[];
}

export interface CreateTimeBasedTriggerData {
  trigger_type: 'time_based';
  name: string;
  template_id: string;
  time_offset_value: number;
  time_offset_unit: TimeOffsetUnit;
  time_reference: TimeReference;
  send_time: string; // HH:MM format
  property_ids?: string[];
}

export type CreateTriggerData = CreateEventTriggerData | CreateTimeBasedTriggerData;

// Helper type for trigger display
export interface TriggerDisplay {
  id: string;
  templateName: string;
  description: string; // Human-readable trigger description
  properties: string[]; // Property names
  isActive: boolean;
  createdAt: string;
}
