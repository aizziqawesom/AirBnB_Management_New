// Inbox service for managing booking threads and message history

import { createClient } from '@/lib/supabase/server';
import type { BookingThread, InboxFilters, InboxStats } from '@/lib/types/inbox';
import type { SentMessageWithBooking } from '@/lib/types/sent-message';

/**
 * Get inbox threads grouped by booking
 * Returns bookings with their associated messages
 */
export async function getInboxThreads(
  filters?: InboxFilters
): Promise<BookingThread[]> {
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('sent_messages')
    .select(`
      *,
      booking:bookings(
        id,
        guest_name,
        check_in,
        check_out,
        status,
        property:properties(id, name)
      ),
      template:message_templates(id, title),
      trigger:message_triggers(id, trigger_type)
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  const { data: messages, error } = await query;

  if (error) {
    console.error('Error fetching inbox threads:', error);
    throw error;
  }

  if (!messages || messages.length === 0) {
    return [];
  }

  // Group messages by booking_id
  const threadsMap = new Map<string, BookingThread>();

  messages.forEach((msg: SentMessageWithBooking) => {
    if (!msg.booking_id) return; // Skip messages without booking

    if (!threadsMap.has(msg.booking_id)) {
      threadsMap.set(msg.booking_id, {
        booking_id: msg.booking_id,
        booking: msg.booking || {
          id: msg.booking_id,
          guest_name: 'Unknown Guest',
          check_in: '',
          check_out: '',
          status: 'unknown',
          property: null,
        },
        messages: [],
        latest_message_at: msg.created_at,
        message_count: 0,
        failed_count: 0,
      });
    }

    const thread = threadsMap.get(msg.booking_id)!;
    thread.messages.push(msg);
    thread.message_count++;

    // Track failed messages
    if (msg.status === 'failed') {
      thread.failed_count++;
    }

    // Update latest message timestamp
    if (new Date(msg.created_at) > new Date(thread.latest_message_at)) {
      thread.latest_message_at = msg.created_at;
    }
  });

  // Convert map to array and sort by latest message
  let threads = Array.from(threadsMap.values()).sort(
    (a, b) =>
      new Date(b.latest_message_at).getTime() -
      new Date(a.latest_message_at).getTime()
  );

  // Apply property filter (after grouping since property is in booking)
  if (filters?.property_id) {
    threads = threads.filter(
      (thread) => thread.booking.property?.id === filters.property_id
    );
  }

  return threads;
}

/**
 * Get single thread with all messages for a booking
 */
export async function getBookingThread(
  bookingId: string
): Promise<BookingThread | null> {
  const threads = await getInboxThreads();
  return threads.find((thread) => thread.booking_id === bookingId) || null;
}

/**
 * Get inbox statistics
 */
export async function getInboxStats(): Promise<InboxStats> {
  const supabase = await createClient();

  // Get all threads
  const threads = await getInboxThreads();

  // Calculate stats
  const total_threads = threads.length;
  const threads_with_failures = threads.filter((t) => t.failed_count > 0).length;
  const total_messages_sent = threads.reduce((sum, t) => sum + t.message_count, 0);

  // Messages in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: messages_last_7_days } = await supabase
    .from('sent_messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  return {
    total_threads,
    threads_with_failures,
    total_messages_sent,
    messages_last_7_days: messages_last_7_days || 0,
  };
}
