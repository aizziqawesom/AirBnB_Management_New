'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { bookingSchema, type BookingFormValues } from '@/lib/validations/booking';
import { createBooking, updateBooking } from '@/lib/actions/bookings';
import type { Property } from '@/lib/types/property';
import type { BookingSource } from '@/lib/types/booking';

const bookingSources: BookingSource[] = ['TikTok', 'WhatsApp', 'Instagram', 'Direct', 'Other'];

interface BookingFormProps {
  properties: Property[];
  mode?: 'create' | 'edit';
  bookingId?: string;
  initialValues?: BookingFormValues;
}

export function BookingForm({ properties, mode = 'create', bookingId, initialValues }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialValues || {
      guest_name: '',
      phone: '',
      guest_email: '',
      property_id: '',
      check_in: '',
      check_out: '',
      guests: 1,
      price: 0,
      source: 'WhatsApp',
      notes: '',
    },
  });

  const watchPropertyId = form.watch('property_id');
  const watchCheckIn = form.watch('check_in');
  const watchCheckOut = form.watch('check_out');

  // Calculate nights and auto-fill price
  useEffect(() => {
    if (watchPropertyId && watchCheckIn && watchCheckOut) {
      const property = properties.find(p => p.id === watchPropertyId);
      if (property) {
        const checkIn = new Date(watchCheckIn);
        const checkOut = new Date(watchCheckOut);
        const nights = differenceInDays(checkOut, checkIn);

        if (nights > 0) {
          const totalPrice = property.price_per_night * nights;
          form.setValue('price', totalPrice);
        }
      }
    }
  }, [watchPropertyId, watchCheckIn, watchCheckOut, properties, form]);

  async function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true);

    try {
      const result = mode === 'edit' && bookingId
        ? await updateBooking(bookingId, values)
        : await createBooking(values);

      if (result?.error) {
        console.error(result.error)
        toast.error('Error', {
          description: result.error,
        });
      } else {
        toast.success('Success', {
          description: mode === 'edit' ? 'Booking updated successfully' : 'Booking created successfully',
        });
        // Redirect happens in the server action
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedProperty = properties.find(p => p.id === watchPropertyId);
  const nights = watchCheckIn && watchCheckOut
    ? Math.max(0, differenceInDays(new Date(watchCheckOut), new Date(watchCheckIn)))
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit Booking' : 'Booking Details'}</CardTitle>
        <CardDescription>
          {mode === 'edit' ? 'Update the booking information' : 'Enter the information for the new booking'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="guest_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., John Doe"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+60123456789"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="guest@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Required for automated email notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name} ({property.type}) - Capacity: {property.capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProperty && (
                    <FormDescription>
                      RM {selectedProperty.price_per_night.toFixed(2)} per night · Capacity: {selectedProperty.capacity} guests
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="check_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="check_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={watchCheckIn || new Date().toISOString().split('T')[0]}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {nights > 0 && (
                      <FormDescription>
                        {nights} {nights === 1 ? 'night' : 'nights'}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={selectedProperty?.capacity || 20}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {selectedProperty
                        ? `Maximum: ${selectedProperty.capacity} guests`
                        : '1-20 guests'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price (RM)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {nights > 0 && selectedProperty && (
                      <FormDescription>
                        Auto-calculated: {nights} nights × RM {selectedProperty.price_per_night.toFixed(2)}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Source</FormLabel>
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
                      {bookingSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any special requests or notes about this booking..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting
                  ? (mode === 'edit' ? 'Updating...' : 'Creating...')
                  : (mode === 'edit' ? 'Update Booking' : 'Create Booking')
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
