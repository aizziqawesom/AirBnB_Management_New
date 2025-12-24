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
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property';
import { createProperty, updateProperty } from '@/lib/actions/properties';
import type { PropertyAmenity, PropertyType, PropertyStatus } from '@/lib/types/property';

const propertyTypes: PropertyType[] = [
  'Studio',
  '1BR Apartment',
  '2BR Apartment',
  '3BR Apartment',
  'Villa',
];

const propertyStatuses: PropertyStatus[] = ['available', 'maintenance', 'unavailable'];

const amenitiesList: PropertyAmenity[] = [
  'WiFi',
  'AC',
  'Kitchen',
  'Washing Machine',
  'Pool Access',
  'Parking',
  'TV',
  'Gym',
];

interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
  mode?: 'create' | 'edit';
  propertyId?: string;
}

export function PropertyForm({ initialValues, mode = 'create', propertyId }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialValues?.name || '',
      type: initialValues?.type || null,
      capacity: initialValues?.capacity || 1,
      price_per_night: initialValues?.price_per_night || 50,
      amenities: initialValues?.amenities || [],
      status: initialValues?.status || 'available',
    },
  });

  async function onSubmit(values: PropertyFormValues) {
    setIsSubmitting(true);

    try {
      const result = mode === 'edit' && propertyId
        ? await updateProperty(propertyId, values)
        : await createProperty(values);

      if (result?.error) {
        toast.error('Error', {
          description: result.error,
        });
      } else {
        toast.success('Success', {
          description: mode === 'edit' ? 'Property updated successfully' : 'Property created successfully',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>
          {mode === 'edit' ? 'Update the information for your property' : 'Enter the information for your new property'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sunset Beach Villa"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Maximum number of guests (1-20)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price_per_night"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night (RM)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={50}
                        step={0.01}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 50)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Minimum RM 50</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                        {propertyStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription>
                      Select all amenities available at this property
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  return checked
                                    ? field.onChange([...value, amenity])
                                    : field.onChange(value.filter((v) => v !== amenity));
                                }}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{amenity}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
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
                  : (mode === 'edit' ? 'Update Property' : 'Create Property')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
