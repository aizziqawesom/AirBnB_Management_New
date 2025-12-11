import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingMessage } from './message-sender';
import type { BookingStatus } from '@/lib/types/booking';
import type { EventType } from '@/lib/types/trigger';

/**
 * Map booking status to event type
 */
const STATUS_TO_EVENT_MAP: Record<BookingStatus, EventType> = {
  pending: 'booking_created',
  confirmed: 'booking_confirmed',
  checked_in: 'booking_checked_in',
  checked_out: 'booking_checked_out',
  completed: 'booking_completed',
  cancelled: 'booking_cancelled',
  no_show: 'booking_no_show',
};

/**
 * Trigger event-based messages for a booking status change
 * @param bookingId - UUID of the booking
 * @param status - New booking status
 */
export async function triggerEventBasedMessages(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const supabase = createAdminClient();

  try {
    // 1. Map status to event type
    const eventType = STATUS_TO_EVENT_MAP[status];
    if (!eventType) {
      console.error(`Unknown booking status: ${status}`);
      return;
    }

    console.log(
      `Processing event-based triggers for booking ${bookingId}, event: ${eventType}`
    );

    // 2. Get booking with property info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, property_id, organization_id, guest_email')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Failed to fetch booking:', bookingError);
      return;
    }

    // Skip if no guest email
    if (!booking.guest_email) {
      console.log(`No guest email for booking ${bookingId}, skipping triggers`);
      return;
    }

    // 3. Find all active event triggers for this event type
    const { data: triggers, error: triggersError } = await supabase
      .from('message_triggers')
      .select(
        `
        id,
        template_id,
        trigger_property_assignments (
          property_id
        )
      `
      )
      .eq('organization_id', booking.organization_id)
      .eq('trigger_type', 'event')
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (triggersError) {
      console.error('Failed to fetch triggers:', triggersError);
      return;
    }

    if (!triggers || triggers.length === 0) {
      console.log(`No active triggers found for event: ${eventType}`);
      return;
    }

    // 4. Filter triggers by property assignment
    const applicableTriggers = triggers.filter((trigger) => {
      // If no property assignments, trigger applies to all properties
      if (
        !trigger.trigger_property_assignments ||
        trigger.trigger_property_assignments.length === 0
      ) {
        return true;
      }

      // Check if booking's property is in the assignments
      return trigger.trigger_property_assignments.some(
        (assignment: { property_id: string }) =>
          assignment.property_id === booking.property_id
      );
    });

    if (applicableTriggers.length === 0) {
      console.log(
        `No triggers applicable for property ${booking.property_id} and event ${eventType}`
      );
      return;
    }

    // 5. Send messages for each applicable trigger
    console.log(
      `Found ${applicableTriggers.length} applicable trigger(s) for booking ${bookingId}`
    );

    const sendPromises = applicableTriggers.map((trigger) =>
      sendBookingMessage(bookingId, trigger.id, trigger.template_id).catch(
        (error) => {
          console.error(
            `Failed to send message for trigger ${trigger.id}:`,
            error
          );
          return { success: false, error: error.message };
        }
      )
    );

    const results = await Promise.allSettled(sendPromises);

    // Log results
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.length - successful;

    console.log(
      `Message sending complete for booking ${bookingId}: ${successful} successful, ${failed} failed`
    );
  } catch (error) {
    console.error('Unexpected error in triggerEventBasedMessages:', error);
  }
}

/**
 * Check if a trigger should fire for a specific booking
 * Used for manual trigger testing
 * @param triggerId - UUID of the trigger
 * @param bookingId - UUID of the booking
 * @returns True if trigger should fire
 */
export async function shouldTriggerFire(
  triggerId: string,
  bookingId: string
): Promise<boolean> {
  const supabase = createAdminClient();

  try {
    // Get trigger details
    const { data: trigger, error: triggerError } = await supabase
      .from('message_triggers')
      .select(
        `
        id,
        trigger_type,
        event_type,
        is_active,
        trigger_property_assignments (
          property_id
        )
      `
      )
      .eq('id', triggerId)
      .single();

    if (triggerError || !trigger || !trigger.is_active) {
      return false;
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('property_id, status, guest_email')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking || !booking.guest_email) {
      return false;
    }

    // Check if trigger applies to this property
    if (
      trigger.trigger_property_assignments &&
      trigger.trigger_property_assignments.length > 0
    ) {
      const hasPropertyMatch = trigger.trigger_property_assignments.some(
        (assignment: { property_id: string }) =>
          assignment.property_id === booking.property_id
      );

      if (!hasPropertyMatch) {
        return false;
      }
    }

    // For event triggers, check if status matches
    if (trigger.trigger_type === 'event' && trigger.event_type) {
      const expectedStatus = Object.entries(STATUS_TO_EVENT_MAP).find(
        ([, event]) => event === trigger.event_type
      )?.[0];

      return expectedStatus === booking.status;
    }

    return true;
  } catch (error) {
    console.error('Error in shouldTriggerFire:', error);
    return false;
  }
}
