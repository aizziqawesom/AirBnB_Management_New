// Inbox type definitions for booking thread view

import type { SentMessageWithBooking, MessageStatus } from './sent-message';

export interface BookingThread {
  booking_id: string;
  booking: {
    id: string;
    guest_name: string;
    check_in: string;
    check_out: string;
    status: string;
    property: {
      id: string;
      name: string;
    } | null;
    // ota_source?: 'direct' | 'airbnb' | 'booking_com' | 'agoda' | 'vrbo' | null; // TODO: Add to database schema
  };
  messages: SentMessageWithBooking[];
  latest_message_at: string;
  message_count: number;
  failed_count: number;
}

export interface InboxFilters {
  property_id?: string;
  date_from?: string;
  date_to?: string;
  status?: MessageStatus;
  channel?: 'email' | 'whatsapp';
}

export interface InboxStats {
  total_threads: number;
  threads_with_failures: number;
  total_messages_sent: number;
  messages_last_7_days: number;
}
