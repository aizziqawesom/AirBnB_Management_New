import { z } from 'zod';

// Event trigger validation schema
export const eventTriggerSchema = z.object({
  trigger_type: z.literal('event'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  template_id: z.string().uuid('Invalid template ID'),
  event_type: z.enum([
    'booking_created',
    'booking_confirmed',
    'booking_cancelled',
    'booking_checked_in',
    'booking_checked_out',
    'booking_completed',
    'booking_no_show',
  ]),
  property_ids: z.array(z.string().uuid()).optional(),
});

// Time-based trigger validation schema
export const timeBasedTriggerSchema = z.object({
  trigger_type: z.literal('time_based'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  template_id: z.string().uuid('Invalid template ID'),
  time_offset_value: z.number().int().positive('Offset must be a positive number'),
  time_offset_unit: z.enum(['hours', 'days']),
  time_reference: z.enum([
    'before_checkin',
    'after_checkin',
    'before_checkout',
    'after_checkout',
  ]),
  send_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  property_ids: z.array(z.string().uuid()).optional(),
});

// Discriminated union for trigger creation
export const triggerSchema = z.discriminatedUnion('trigger_type', [
  eventTriggerSchema,
  timeBasedTriggerSchema,
]);

// Update trigger schema (partial with id)
export const updateTriggerSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean().optional(),
  property_ids: z.array(z.string().uuid()).optional(),
});

// Validation helper types
export type EventTriggerInput = z.infer<typeof eventTriggerSchema>;
export type TimeBasedTriggerInput = z.infer<typeof timeBasedTriggerSchema>;
export type TriggerInput = z.infer<typeof triggerSchema>;
export type UpdateTriggerInput = z.infer<typeof updateTriggerSchema>;
