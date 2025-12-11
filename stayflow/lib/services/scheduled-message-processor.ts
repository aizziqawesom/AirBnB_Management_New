import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingMessage } from './message-sender';
import type { TimeOffsetUnit, TimeReference } from '@/lib/types/trigger';

export interface ProcessScheduledMessagesResult {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Calculate the target date/time for a time-based trigger
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @param timeOffsetValue - Number of hours/days
 * @param timeOffsetUnit - 'hours' or 'days'
 * @param timeReference - What to calculate from
 * @param sendTime - Time to send (HH:MM:SS)
 * @returns Target datetime
 */
function calculateTriggerTime(
  checkIn: string,
  checkOut: string,
  timeOffsetValue: number,
  timeOffsetUnit: TimeOffsetUnit,
  timeReference: TimeReference,
  sendTime: string
): Date {
  // Determine the base date
  let baseDate: Date;
  switch (timeReference) {
    case 'before_checkin':
    case 'after_checkin':
      baseDate = new Date(checkIn);
      break;
    case 'before_checkout':
    case 'after_checkout':
      baseDate = new Date(checkOut);
      break;
  }

  // Calculate offset in milliseconds
  let offsetMs: number;
  if (timeOffsetUnit === 'hours') {
    offsetMs = timeOffsetValue * 60 * 60 * 1000;
  } else {
    // days
    offsetMs = timeOffsetValue * 24 * 60 * 60 * 1000;
  }

  // Apply offset (subtract for 'before', add for 'after')
  let targetDate: Date;
  if (timeReference.startsWith('before')) {
    targetDate = new Date(baseDate.getTime() - offsetMs);
  } else {
    targetDate = new Date(baseDate.getTime() + offsetMs);
  }

  // Set the specific time (HH:MM:SS)
  const [hours, minutes, seconds = '0'] = sendTime.split(':').map(Number);
  targetDate.setHours(hours, minutes, seconds || 0, 0);

  return targetDate;
}

/**
 * Check if a trigger should fire in the current hour
 * @param targetTime - When the trigger should fire
 * @param currentTime - Current time
 * @returns True if trigger should fire now
 */
function shouldFireNow(targetTime: Date, currentTime: Date): boolean {
  // Check if target time is in the past hour (to account for cron running hourly)
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

  return targetTime >= oneHourAgo && targetTime <= currentTime;
}

/**
 * Process all scheduled (time-based) messages that should be sent
 * This function is called by the cron job every hour
 * @returns Statistics about processed messages
 */
export async function processScheduledMessages(): Promise<ProcessScheduledMessagesResult> {
  const supabase = createAdminClient();
  const currentTime = new Date();

  console.log(`[CRON] Processing scheduled messages at ${currentTime.toISOString()}`);

  const stats: ProcessScheduledMessagesResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
  };

  try {
    // 1. Fetch all active time-based triggers
    const { data: triggers, error: triggersError } = await supabase
      .from('message_triggers')
      .select(
        `
        id,
        organization_id,
        template_id,
        time_offset_value,
        time_offset_unit,
        time_reference,
        send_time,
        trigger_property_assignments (
          property_id
        )
      `
      )
      .eq('trigger_type', 'time_based')
      .eq('is_active', true);

    if (triggersError) {
      console.error('[CRON] Error fetching triggers:', triggersError);
      return stats;
    }

    if (!triggers || triggers.length === 0) {
      console.log('[CRON] No active time-based triggers found');
      return stats;
    }

    console.log(`[CRON] Found ${triggers.length} active time-based trigger(s)`);

    // 2. For each trigger, find bookings that should receive messages
    for (const trigger of triggers) {
      try {
        // Build query for bookings
        let bookingsQuery = supabase
          .from('bookings')
          .select('id, property_id, check_in, check_out, guest_email, organization_id')
          .eq('organization_id', trigger.organization_id)
          .not('guest_email', 'is', null);

        // Filter by property if assignments exist
        if (
          trigger.trigger_property_assignments &&
          trigger.trigger_property_assignments.length > 0
        ) {
          const propertyIds = trigger.trigger_property_assignments.map(
            (a: { property_id: string }) => a.property_id
          );
          bookingsQuery = bookingsQuery.in('property_id', propertyIds);
        }

        // Only get bookings that are in relevant timeframe
        // (check-in/check-out within next 30 days or past 7 days)
        const thirtyDaysFromNow = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);

        bookingsQuery = bookingsQuery
          .gte('check_in', sevenDaysAgo.toISOString())
          .lte('check_in', thirtyDaysFromNow.toISOString());

        const { data: bookings, error: bookingsError } = await bookingsQuery;

        if (bookingsError) {
          console.error(`[CRON] Error fetching bookings for trigger ${trigger.id}:`, bookingsError);
          continue;
        }

        if (!bookings || bookings.length === 0) {
          continue;
        }

        // 3. For each booking, check if message should be sent now
        for (const booking of bookings) {
          stats.processed++;

          try {
            // Calculate when this trigger should fire for this booking
            const triggerTime = calculateTriggerTime(
              booking.check_in,
              booking.check_out,
              trigger.time_offset_value!,
              trigger.time_offset_unit as TimeOffsetUnit,
              trigger.time_reference as TimeReference,
              trigger.send_time!
            );

            // Check if we should fire now
            if (!shouldFireNow(triggerTime, currentTime)) {
              stats.skipped++;
              continue;
            }

            // Check if message was already sent (idempotency)
            const idempotencyKey = `${booking.id}-${trigger.id}`;
            const { data: existingIdempotency } = await supabase
              .from('message_idempotency')
              .select('id')
              .eq('idempotency_key', idempotencyKey)
              .single();

            if (existingIdempotency) {
              console.log(
                `[CRON] Message already sent for booking ${booking.id} and trigger ${trigger.id}`
              );
              stats.skipped++;
              continue;
            }

            // Send the message
            console.log(
              `[CRON] Sending scheduled message for booking ${booking.id}, trigger ${trigger.id}`
            );

            const result = await sendBookingMessage(
              booking.id,
              trigger.id,
              trigger.template_id
            );

            if (result.success) {
              stats.sent++;
              console.log(
                `[CRON] Successfully sent message for booking ${booking.id}`
              );
            } else {
              stats.failed++;
              console.error(
                `[CRON] Failed to send message for booking ${booking.id}:`,
                result.error
              );
            }
          } catch (bookingError) {
            stats.failed++;
            console.error(
              `[CRON] Error processing booking ${booking.id}:`,
              bookingError
            );
          }
        }
      } catch (triggerError) {
        console.error(`[CRON] Error processing trigger ${trigger.id}:`, triggerError);
      }
    }

    console.log('[CRON] Scheduled message processing complete:', stats);
    return stats;
  } catch (error) {
    console.error('[CRON] Unexpected error in processScheduledMessages:', error);
    return stats;
  }
}

/**
 * Preview when a time-based trigger will fire for a booking
 * Useful for testing and displaying in the UI
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @param timeOffsetValue - Number of hours/days
 * @param timeOffsetUnit - 'hours' or 'days'
 * @param timeReference - What to calculate from
 * @param sendTime - Time to send (HH:MM:SS)
 * @returns ISO string of when trigger will fire
 */
export function previewTriggerTime(
  checkIn: string,
  checkOut: string,
  timeOffsetValue: number,
  timeOffsetUnit: TimeOffsetUnit,
  timeReference: TimeReference,
  sendTime: string
): string {
  const triggerTime = calculateTriggerTime(
    checkIn,
    checkOut,
    timeOffsetValue,
    timeOffsetUnit,
    timeReference,
    sendTime
  );

  return triggerTime.toISOString();
}
