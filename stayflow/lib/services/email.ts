import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend API
 * @param params - Email parameters (to, subject, html content)
 * @returns Result object with success status and message ID or error
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailParams): Promise<SendEmailResult> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service is not configured',
      };
    }

    if (!process.env.RESEND_FROM_EMAIL && !from) {
      console.error('RESEND_FROM_EMAIL is not configured');
      return {
        success: false,
        error: 'Email sender address is not configured',
      };
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL!,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    if (!data || !data.id) {
      console.error('No data returned from Resend API');
      return {
        success: false,
        error: 'No response from email service',
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Verify email configuration is valid
 * @returns True if configuration is valid
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
