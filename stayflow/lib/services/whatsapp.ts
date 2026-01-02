import type {
  SendWhatsAppParams,
  SendWhatsAppResult,
  WhatsAppApiPayload,
  WhatsAppApiResponse,
} from '@/lib/types/whatsapp';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

/**
 * Send WhatsApp message using template
 * @param params - WhatsApp message parameters
 * @returns Result object with success status and message ID or error
 */
export async function sendWhatsAppMessage({
  to,
  templateName,
  templateParams,
  languageCode = 'en_US',
}: SendWhatsAppParams): Promise<SendWhatsAppResult> {
  try {
    // Validate environment variables
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      console.error('WhatsApp credentials not configured');
      return {
        success: false,
        error: 'WhatsApp service is not configured',
      };
    }

    // Build template components
    const components = [];
    if (templateParams.length > 0) {
      components.push({
        type: 'body' as const,
        parameters: templateParams.map((text) => ({
          type: 'text' as const,
          text,
        })),
      });
    }

    // Prepare API request
    const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
    const payload: WhatsAppApiPayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components.length > 0 ? components : undefined,
      },
    };

    console.log(`Sending WhatsApp message to ${to} using template ${templateName}`);

    // Send request to WhatsApp API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: WhatsAppApiResponse = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', data);
      return {
        success: false,
        error: data.error?.message || 'Failed to send WhatsApp message',
      };
    }

    // Extract message ID from response
    const messageId = data.messages?.[0]?.id;
    if (!messageId) {
      console.error('No message ID in WhatsApp response:', data);
      return {
        success: false,
        error: 'No message ID returned from WhatsApp',
      };
    }

    console.log(`WhatsApp message sent successfully. Message ID: ${messageId}`);

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error('Unexpected error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Verify WhatsApp configuration is valid
 * @returns True if configuration is valid
 */
export function isWhatsAppConfigured(): boolean {
  return !!(PHONE_NUMBER_ID && ACCESS_TOKEN);
}

/**
 * Format phone number for WhatsApp API (remove + and spaces)
 * @param phone - Phone number with or without country code
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[+\s-]/g, '');
}
