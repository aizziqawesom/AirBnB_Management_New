import { Resend } from 'resend';
import { ReactElement } from 'react';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  react?: ReactElement;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend API
 * @param params - Email parameters (to, subject, html or react content)
 * @returns Result object with success status and message ID or error
 */
export async function sendEmail({
  to,
  subject,
  html,
  react,
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

    // Use default from address for testing with Resend's domain
    const fromAddress = from || 'StayFlow <onboarding@resend.dev>';

    // Send email via Resend
    const emailData: any = {
      from: fromAddress,
      to: [to],
      subject,
    };

    // Use React template if provided, otherwise use HTML
    if (react) {
      emailData.react = react;
    } else if (html) {
      emailData.html = html;
    } else {
      return {
        success: false,
        error: 'Either html or react content must be provided',
      };
    }

    const { data, error } = await resend.emails.send(emailData);

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
