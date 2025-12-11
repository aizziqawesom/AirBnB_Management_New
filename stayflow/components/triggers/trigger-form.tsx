'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { triggerSchema } from '@/lib/validations/trigger';
import { createTrigger } from '@/lib/actions/triggers';
import type { CreateTriggerData, EventType, TimeOffsetUnit, TimeReference } from '@/lib/types/trigger';

interface TriggerFormProps {
  templates: Array<{
    id: string;
    title: string;
    recipient: string;
  }>;
  properties: Array<{
    id: string;
    name: string;
  }>;
}

export function TriggerForm({ templates, properties }: TriggerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triggerType, setTriggerType] = useState<'event' | 'time_based'>('event');
  const router = useRouter();

  const form = useForm<CreateTriggerData>({
    resolver: zodResolver(triggerSchema),
    defaultValues: {
      trigger_type: 'event',
      name: '',
      template_id: '',
      event_type: 'booking_created' as EventType,
      property_ids: [],
    },
  });

  async function onSubmit(values: CreateTriggerData) {
    setIsSubmitting(true);

    try {
      const result = await createTrigger(values);

      if (result.success) {
        toast.success('Trigger created successfully');
        router.push('/messages/triggers');
      } else {
        toast.error('Error', {
          description: result.error || 'Failed to create trigger',
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Trigger</CardTitle>
        <CardDescription>
          Set up an automated email trigger based on booking events or scheduled times
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Trigger Type Selection */}
            <FormField
              control={form.control}
              name="trigger_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTriggerType(value as 'event' | 'time_based');
                    }}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="event">Event-Based (fires when booking status changes)</SelectItem>
                      <SelectItem value="time_based">Time-Based (fires at a specific time)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trigger Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Welcome Email, Check-in Reminder"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to identify this trigger
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Selection */}
            <FormField
              control={form.control}
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title} ({template.recipient})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The email template that will be sent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event-Based Fields */}
            {triggerType === 'event' && (
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Event</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="booking_created">Booking Created (status: pending)</SelectItem>
                        <SelectItem value="booking_confirmed">Booking Confirmed</SelectItem>
                        <SelectItem value="booking_checked_in">Guest Checked In</SelectItem>
                        <SelectItem value="booking_checked_out">Guest Checked Out</SelectItem>
                        <SelectItem value="booking_completed">Booking Completed</SelectItem>
                        <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                        <SelectItem value="booking_no_show">Guest No-Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      When to send the email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Time-Based Fields */}
            {triggerType === 'time_based' && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="time_offset_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Offset</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time_offset_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time_reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="before_checkin">Before Check-in</SelectItem>
                            <SelectItem value="after_checkin">After Check-in</SelectItem>
                            <SelectItem value="before_checkout">Before Check-out</SelectItem>
                            <SelectItem value="after_checkout">After Check-out</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="send_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        What time of day to send the email (24-hour format)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Property Selection */}
            <FormField
              control={form.control}
              name="property_ids"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Apply to Properties</FormLabel>
                    <FormDescription>
                      Select specific properties or leave all unchecked to apply to all properties
                    </FormDescription>
                  </div>
                  <div className="space-y-2">
                    {properties.map((property) => (
                      <FormField
                        key={property.id}
                        control={form.control}
                        name="property_ids"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={property.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(property.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), property.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== property.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {property.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating...' : 'Create Trigger'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
