// WhatsApp Business API type definitions

export interface SendWhatsAppParams {
  to: string; // Phone number with country code (e.g., "60123456789")
  templateName: string;
  templateParams: string[]; // Ordered array of template parameter values
  languageCode?: string; // Default: 'en'
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId?: string; // WhatsApp message ID from API response
  error?: string;
}

export interface WhatsAppTemplateComponent {
  type: 'body' | 'header';
  parameters: Array<{
    type: 'text';
    text: string;
  }>;
}

export interface WhatsAppApiPayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: WhatsAppTemplateComponent[];
  };
}

export interface WhatsAppApiResponse {
  messages?: Array<{
    id: string;
  }>;
  error?: {
    message: string;
    code?: number;
  };
}
