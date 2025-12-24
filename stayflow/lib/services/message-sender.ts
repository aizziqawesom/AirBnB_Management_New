import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from './email';
import { BookingEmailTemplate } from '@/components/email/booking-email-template';
import {
  extractTemplateVariables,
  replaceTemplateVariables,
  generateEmailSubject,
  templateToHtml,
} from './template-parser';
import type { Booking } from '@/lib/types/booking';

export interface SendMessageResult {
  success: boolean;
  error?: string;
  sentMessageId?: string;
}

/**
 * Send a booking message via email with idempotency protection
 * @param bookingId - UUID of the booking
 * @param triggerId - UUID of the trigger
 * @param templateId - UUID of the message template
 * @returns Result object with success status
 */
export async function sendBookingMessage(
  bookingId: string,
  triggerId: string,
  templateId: string
): Promise<SendMessageResult> {
  const supabase = createAdminClient();

  try {
    // 1. Check idempotency - prevent duplicate sends
    const idempotencyKey = `${bookingId}-${triggerId}`;

    const { data: existingIdempotency } = await supabase
      .from('message_idempotency')
      .select('id, sent_message_id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingIdempotency) {
      console.log(
        `Message already sent for booking ${bookingId} and trigger ${triggerId}`
      );
      return {
        success: true,
        sentMessageId: existingIdempotency.sent_message_id || undefined,
      };
    }

    // 2. Fetch booking with property details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        properties (
          id,
          name
        )
      `
      )
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Failed to fetch booking:', bookingError);
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    // Check if guest email is available
    if (!booking.guest_email) {
      console.log(`No guest email for booking ${bookingId}, skipping message`);
      return {
        success: false,
        error: 'Guest email not provided',
      };
    }

    // 3. Fetch message template
    const { data: template, error: templateError } = await supabase
      .from('message_templates')
      .select('id, name, message_content')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      console.error('Failed to fetch template:', templateError);
      return {
        success: false,
        error: 'Template not found',
      };
    }

    // 4. Parse template and replace variables
    const variables = extractTemplateVariables(
      booking as Booking & { properties: { name: string } }
    );
    const messageBody = replaceTemplateVariables(
      template.message_content,
      variables
    );
    const subject = generateEmailSubject(
      template.name,
      booking as Booking & { properties: { name: string } }
    );

    // 5. Create sent_messages record (pending status)
    const { data: sentMessage, error: createError } = await supabase
      .from('sent_messages')
      .insert({
        organization_id: booking.organization_id,
        booking_id: bookingId,
        trigger_id: triggerId,
        template_id: templateId,
        recipient_email: booking.guest_email,
        recipient_name: booking.guest_name,
        subject,
        body: messageBody,
        status: 'pending',
        provider: 'resend',
      })
      .select()
      .single();

    if (createError || !sentMessage) {
      console.error('Failed to create sent_messages record:', createError);
      return {
        success: false,
        error: 'Failed to create message record',
      };
    }

    // 6. Send email via Resend using React template
    const emailResult = await sendEmail({
      to: booking.guest_email,
      subject,
      react: BookingEmailTemplate({
        guestName: variables.guest_name,
        propertyName: variables.property_name,
        checkInDate: variables.check_in_date,
        checkOutDate: variables.check_out_date,
        bookingReference: variables.booking_reference,
        totalPrice: variables.total_price,
        numGuests: variables.num_guests,
        status: variables.status,
      }),
    });

    // 7. Update sent_messages record with result
    if (emailResult.success) {
      await supabase
        .from('sent_messages')
        .update({
          status: 'sent',
          provider_message_id: emailResult.messageId,
          sent_at: new Date().toISOString(),
        })
        .eq('id', sentMessage.id);

      // 8. Record idempotency to prevent duplicate sends
      await supabase.from('message_idempotency').insert({
        organization_id: booking.organization_id,
        booking_id: bookingId,
        trigger_id: triggerId,
        idempotency_key: idempotencyKey,
        sent_message_id: sentMessage.id,
      });

      console.log(
        `Successfully sent email to ${booking.guest_email} for booking ${bookingId}`
      );

      return {
        success: true,
        sentMessageId: sentMessage.id,
      };
    } else {
      // Update with failure status
      await supabase
        .from('sent_messages')
        .update({
          status: 'failed',
          error_message: emailResult.error,
          retry_count: 1,
        })
        .eq('id', sentMessage.id);

      console.error(
        `Failed to send email for booking ${bookingId}:`,
        emailResult.error
      );

      return {
        success: false,
        error: emailResult.error,
        sentMessageId: sentMessage.id,
      };
    }
  } catch (error) {
    console.error('Unexpected error in sendBookingMessage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Retry sending a failed message
 * @param sentMessageId - UUID of the sent_messages record
 * @returns Result object with success status
 */
export async function retryFailedMessage(
  sentMessageId: string
): Promise<SendMessageResult> {
  const supabase = createAdminClient();

  try {
    // Fetch the failed message
    const { data: sentMessage, error: fetchError } = await supabase
      .from('sent_messages')
      .select('*')
      .eq('id', sentMessageId)
      .single();

    if (fetchError || !sentMessage) {
      return {
        success: false,
        error: 'Message not found',
      };
    }

    if (sentMessage.status === 'sent') {
      return {
        success: true,
        sentMessageId,
      };
    }

    // Convert body to HTML and send
    const htmlBody = templateToHtml(sentMessage.body);

    const emailResult = await sendEmail({
      to: sentMessage.recipient_email,
      subject: sentMessage.subject,
      html: htmlBody,
    });

    // Update message status
    if (emailResult.success) {
      await supabase
        .from('sent_messages')
        .update({
          status: 'sent',
          provider_message_id: emailResult.messageId,
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq('id', sentMessageId);

      return {
        success: true,
        sentMessageId,
      };
    } else {
      await supabase
        .from('sent_messages')
        .update({
          error_message: emailResult.error,
          retry_count: sentMessage.retry_count + 1,
        })
        .eq('id', sentMessageId);

      return {
        success: false,
        error: emailResult.error,
        sentMessageId,
      };
    }
  } catch (error) {
    console.error('Unexpected error in retryFailedMessage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
