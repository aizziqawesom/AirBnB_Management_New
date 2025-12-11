import { z } from 'zod';

export const bookingSchema = z.object({
  guest_name: z.string().min(1, 'Guest name is required').max(100),
  phone: z.string().min(1, 'Phone number is required').max(20),
  guest_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  property_id: z.string().uuid('Invalid property'),
  check_in: z.string().min(1, 'Check-in date is required'),
  check_out: z.string().min(1, 'Check-out date is required'),
  guests: z.number().int().min(1).max(20),
  price: z.number().min(0),
  source: z.enum(['TikTok', 'WhatsApp', 'Instagram', 'Direct', 'Other']),
  notes: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.check_in);
  const checkOut = new Date(data.check_out);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['check_out'],
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
