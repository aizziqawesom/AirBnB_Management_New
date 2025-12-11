import type { Booking } from '@/lib/types/booking';

/**
 * Extract template variables from a booking
 * @param booking - Booking object with property details
 * @returns Object with variable names as keys and formatted values
 */
export function extractTemplateVariables(
  booking: Booking & {
    properties?: {
      name: string;
    };
  }
): Record<string, string> {
  // Format dates
  const checkInDate = new Date(booking.check_in);
  const checkOutDate = new Date(booking.check_out);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate number of nights
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    guest_name: booking.guest_name,
    guest_email: booking.guest_email || '',
    property_name: booking.properties?.name || 'Property',
    check_in_date: formatDate(checkInDate),
    check_out_date: formatDate(checkOutDate),
    check_in_time: checkInDate.toLocaleTimeString('en-MY', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    check_out_time: checkOutDate.toLocaleTimeString('en-MY', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    booking_reference: booking.id.slice(0, 8).toUpperCase(),
    total_price: `RM${booking.price.toFixed(2)}`,
    num_guests: booking.guests.toString(),
    num_nights: nights.toString(),
    phone: booking.phone,
    status: booking.status.replace('_', ' ').toUpperCase(),
  };
}

/**
 * Replace template variables in a string with actual values
 * Supports both {{variable}} and {variable} syntax
 * @param template - Template string with variables
 * @param variables - Object with variable values
 * @returns String with variables replaced
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  // Replace {{variable}} syntax
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });

  // Also support {variable} syntax (used in existing templates)
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
}

/**
 * Convert plain text template to HTML email format
 * Preserves line breaks and basic formatting
 * @param plainText - Plain text content
 * @returns HTML formatted string
 */
export function templateToHtml(plainText: string): string {
  // Escape HTML special characters
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Convert line breaks to <br> and wrap in paragraphs
  const lines = plainText.split('\n');
  const htmlContent = lines
    .map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        return '<br>';
      }
      return `<p style="margin: 0 0 10px 0; line-height: 1.5;">${escapeHtml(trimmedLine)}</p>`;
    })
    .join('');

  // Wrap in a basic email template
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StayFlow Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 24px; margin: 0 0 20px 0;">
    ${htmlContent}
  </div>
  <div style="text-align: center; color: #999; font-size: 12px; padding: 20px 0;">
    <p>This is an automated message from StayFlow</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate email subject from template name and booking info
 * @param templateName - Name of the template
 * @param booking - Booking information
 * @returns Generated subject line
 */
export function generateEmailSubject(
  templateName: string,
  booking: Booking & { properties?: { name: string } }
): string {
  const propertyName = booking.properties?.name || 'Property';

  // Map template names to subject patterns
  const subjectPatterns: Record<string, string> = {
    'Booking Confirmation': `Booking Confirmed - ${propertyName}`,
    'Pre-arrival Info': `Check-in Tomorrow - ${propertyName}`,
    'Cleaner Schedule': `Cleaning Schedule - ${propertyName}`,
    'Check-in Instructions': `Check-in Instructions - ${propertyName}`,
    'Thank You': `Thank You for Your Stay - ${propertyName}`,
  };

  return subjectPatterns[templateName] || `${templateName} - ${propertyName}`;
}
