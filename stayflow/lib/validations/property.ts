import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Name is too long'),
  type: z.enum(['Studio', '1BR Apartment', '2BR Apartment', '3BR Apartment', 'Villa'], {
    required_error: 'Property type is required',
  }),
  capacity: z.number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(20, 'Capacity cannot exceed 20'),
  price_per_night: z.number()
    .min(50, 'Price must be at least RM 50')
    .max(100000, 'Price is too high'),
  amenities: z.array(z.enum([
    'WiFi',
    'AC',
    'Kitchen',
    'Washing Machine',
    'Pool Access',
    'Parking',
    'TV',
    'Gym',
  ])).default([]),
  status: z.enum(['available', 'maintenance', 'unavailable']).default('available'),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
