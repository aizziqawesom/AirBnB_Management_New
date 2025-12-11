// Sent message type definitions for message history tracking

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'bounced';

export interface SentMessage {
  id: string;
  organization_id: string;
  booking_id: string;
  trigger_id: string | null;
  template_id: string | null;

  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  body: string;

  status: MessageStatus;
  provider: string;
  provider_message_id: string | null;

  error_message: string | null;
  retry_count: number;

  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SentMessageWithBooking extends SentMessage {
  booking?: {
    id: string;
    guest_name: string;
    check_in: string;
    check_out: string;
    status: string;
    property?: {
      id: string;
      name: string;
    };
  };
  trigger?: {
    id: string;
    trigger_type: 'event' | 'time_based';
  };
  template?: {
    id: string;
    name: string;
  };
}

// Filter options for message history
export interface MessageHistoryFilters {
  status?: MessageStatus;
  booking_id?: string;
  property_id?: string;
  date_from?: string;
  date_to?: string;
  recipient_email?: string;
}
