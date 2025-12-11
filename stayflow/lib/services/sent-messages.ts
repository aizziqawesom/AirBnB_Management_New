import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import type {
  SentMessageWithBooking,
  MessageHistoryFilters,
} from '@/lib/types/sent-message';

/**
 * Get sent messages with optional filters
 * @param filters - Optional filters for status, booking, property, dates
 * @returns Array of sent messages with booking details
 */
export async function getSentMessages(
  filters?: MessageHistoryFilters
): Promise<SentMessageWithBooking[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  // Start building the query
  let query = supabase
    .from('sent_messages')
    .select(
      `
      *,
      bookings!sent_messages_booking_id_fkey (
        id,
        guest_name,
        check_in,
        check_out,
        status,
        properties!bookings_property_id_fkey (
          id,
          name
        )
      ),
      message_triggers!sent_messages_trigger_id_fkey (
        id,
        trigger_type
      )
    `
    )
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.booking_id) {
    query = query.eq('booking_id', filters.booking_id);
  }

  if (filters?.recipient_email) {
    query = query.ilike('recipient_email', `%${filters.recipient_email}%`);
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching sent messages:', error);
    throw error;
  }

  // Transform the data to match our interface
  return (data || []).map((message) => {
    const booking = message.bookings
      ? {
          id: message.bookings.id,
          guest_name: message.bookings.guest_name,
          check_in: message.bookings.check_in,
          check_out: message.bookings.check_out,
          status: message.bookings.status,
          property: message.bookings.properties
            ? {
                id: message.bookings.properties.id,
                name: message.bookings.properties.name,
              }
            : undefined,
        }
      : undefined;

    const trigger = message.message_triggers
      ? {
          id: message.message_triggers.id,
          trigger_type: message.message_triggers.trigger_type as
            | 'event'
            | 'time_based',
        }
      : undefined;

    // Template info is stored directly on the message via template_id
    // We don't join to avoid ambiguous foreign key references
    const template = message.template_id
      ? {
          id: message.template_id,
          name: '', // Will be populated from a separate query if needed
        }
      : undefined;

    return {
      ...message,
      booking,
      trigger,
      template,
    } as SentMessageWithBooking;
  });
}

/**
 * Get sent messages for a specific booking
 * @param bookingId - UUID of the booking
 * @returns Array of sent messages for this booking
 */
export async function getSentMessagesByBooking(
  bookingId: string
): Promise<SentMessageWithBooking[]> {
  return getSentMessages({ booking_id: bookingId });
}

/**
 * Get sent messages for a specific property
 * @param propertyId - UUID of the property
 * @returns Array of sent messages for bookings at this property
 */
export async function getSentMessagesByProperty(
  propertyId: string
): Promise<SentMessageWithBooking[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  const { data, error} = await supabase
    .from('sent_messages')
    .select(
      `
      *,
      bookings!inner (
        id,
        guest_name,
        check_in,
        check_out,
        status,
        property_id,
        properties!bookings_property_id_fkey (
          id,
          name
        )
      ),
      message_triggers!sent_messages_trigger_id_fkey (
        id,
        trigger_type
      )
    `
    )
    .eq('organization_id', organization.id)
    .eq('bookings.property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sent messages by property:', error);
    throw error;
  }

  // Transform the data
  return (data || []).map((message) => {
    const booking = message.bookings
      ? {
          id: message.bookings.id,
          guest_name: message.bookings.guest_name,
          check_in: message.bookings.check_in,
          check_out: message.bookings.check_out,
          status: message.bookings.status,
          property: message.bookings.properties
            ? {
                id: message.bookings.properties.id,
                name: message.bookings.properties.name,
              }
            : undefined,
        }
      : undefined;

    const trigger = message.message_triggers
      ? {
          id: message.message_triggers.id,
          trigger_type: message.message_triggers.trigger_type as
            | 'event'
            | 'time_based',
        }
      : undefined;

    // Template info is stored directly on the message via template_id
    // We don't join to avoid ambiguous foreign key references
    const template = message.template_id
      ? {
          id: message.template_id,
          name: '', // Will be populated from a separate query if needed
        }
      : undefined;

    return {
      ...message,
      booking,
      trigger,
      template,
    } as SentMessageWithBooking;
  });
}

/**
 * Get message statistics for the current organization
 * @returns Object with counts by status
 */
export async function getMessageStats(): Promise<{
  total: number;
  sent: number;
  failed: number;
  pending: number;
}> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return { total: 0, sent: 0, failed: 0, pending: 0 };
  }

  const { data, error } = await supabase
    .from('sent_messages')
    .select('status')
    .eq('organization_id', organization.id);

  if (error) {
    console.error('Error fetching message stats:', error);
    return { total: 0, sent: 0, failed: 0, pending: 0 };
  }

  const stats = {
    total: data.length,
    sent: data.filter((m) => m.status === 'sent').length,
    failed: data.filter((m) => m.status === 'failed').length,
    pending: data.filter((m) => m.status === 'pending').length,
  };

  return stats;
}

/**
 * Get recent sent messages (last 10)
 * @returns Array of recent sent messages
 */
export async function getRecentSentMessages(): Promise<
  SentMessageWithBooking[]
> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return [];
  }

  const { data, error } = await supabase
    .from('sent_messages')
    .select(
      `
      *,
      bookings!sent_messages_booking_id_fkey (
        id,
        guest_name,
        check_in,
        check_out,
        status,
        properties!bookings_property_id_fkey (
          id,
          name
        )
      )
    `
    )
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recent messages:', error);
    return [];
  }

  // Transform the data
  return (data || []).map((message) => {
    const booking = message.bookings
      ? {
          id: message.bookings.id,
          guest_name: message.bookings.guest_name,
          check_in: message.bookings.check_in,
          check_out: message.bookings.check_out,
          status: message.bookings.status,
          property: message.bookings.properties
            ? {
                id: message.bookings.properties.id,
                name: message.bookings.properties.name,
              }
            : undefined,
        }
      : undefined;

    const template = message.message_templates
      ? {
          id: message.message_templates.id,
          name: message.message_templates.name,
        }
      : undefined;

    return {
      ...message,
      booking,
      template,
    } as SentMessageWithBooking;
  });
}
