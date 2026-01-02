'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { BookingWithProperty } from '@/lib/types/booking';
import type { Property } from '@/lib/types/property';

interface CalendarPropertyViewProps {
  bookings: BookingWithProperty[];
  properties: Property[];
  currentDate: Date;
  isLoading: boolean;
}

const DAY_WIDTH = 64; // Width in pixels for each day column

export function CalendarPropertyView({
  bookings,
  properties,
  currentDate,
  isLoading
}: CalendarPropertyViewProps) {
  const router = useRouter();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group bookings by property with overlap handling
  const bookingsByProperty = useMemo(() => {
    return properties.map(property => {
      const propertyBookings = bookings.filter(b => b.property_id === property.id);

      // Calculate booking bars with row stacking for overlaps
      const bookingBars = propertyBookings.map(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        // Calculate which day of month the booking starts (0-indexed)
        let startDay: number;
        let endDay: number;

        // Check if booking overlaps with this month at all
        if (checkOut < monthStart || checkIn > monthEnd) {
          return null; // Booking doesn't overlap with this month
        }

        // Calculate start day (clipped to month boundaries)
        if (checkIn < monthStart) {
          startDay = 0; // Starts before this month
        } else {
          startDay = checkIn.getDate() - 1; // Day of month (0-indexed)
        }

        // Calculate end day (clipped to month boundaries)
        if (checkOut > monthEnd) {
          endDay = daysInMonth.length - 1; // Ends after this month
        } else {
          endDay = checkOut.getDate() - 1; // Day of month (0-indexed)
        }

        const span = endDay - startDay + 1;

        if (span <= 0) return null;

        return {
          booking,
          startDay,
          endDay,
          span,
          checkIn,
          checkOut,
        };
      }).filter(Boolean);

      // Sort bookings by start day
      bookingBars.sort((a, b) => a!.startDay - b!.startDay);

      // Assign rows to handle overlapping bookings
      const barsWithRows: Array<NonNullable<typeof bookingBars[0]> & { row: number }> = [];

      for (const bar of bookingBars) {
        if (!bar) continue;

        // Find which row this booking should go in (stack vertically if overlapping)
        let row = 0;

        while (true) {
          const conflict = barsWithRows.find(
            existing =>
              existing.row === row &&
              !(existing.endDay < bar.startDay || existing.startDay > bar.endDay)
          );
          if (!conflict) break;
          row++;
        }

        barsWithRows.push({ ...bar, row });
      }

      const maxRows = barsWithRows.length > 0 ? Math.max(...barsWithRows.map(b => b.row + 1)) : 1;

      return {
        property,
        bookings: barsWithRows as Array<NonNullable<typeof barsWithRows[0]>>,
        maxRows,
      };
    });
  }, [properties, bookings, currentDate, monthStart, monthEnd, daysInMonth]);

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-background">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-background overflow-x-auto">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="flex sticky top-0 z-20 bg-background border-b">
          {/* Property column header */}
          <div className="sticky left-0 z-30 w-48 flex-shrink-0 bg-muted px-4 py-3 font-semibold border-r">
            Properties
          </div>

          {/* Date headers */}
          <div className="flex">
            {daysInMonth.map((day) => (
              <div
                key={day.toISOString()}
                className="w-16 flex-shrink-0 text-center py-3 border-r text-xs font-medium"
              >
                <div>{format(day, 'd')}</div>
                <div className="text-muted-foreground">{format(day, 'EEE')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Rows */}
        <div className="relative">
          {bookingsByProperty.map(({ property, bookings: propertyBookings, maxRows }) => {
            const rowHeight = Math.max(64, maxRows * 28 + 36); // Dynamic height based on stacked bookings

            return (
              <div key={property.id} className="flex border-b hover:bg-accent/5">
                {/* Property name (sticky) */}
                <div
                  className="sticky left-0 z-10 w-48 flex-shrink-0 bg-background px-4 py-4 border-r font-medium truncate flex items-start"
                  style={{ height: `${rowHeight}px` }}
                >
                  <span className="line-clamp-2">{property.name}</span>
                </div>

                {/* Date cells with booking bars */}
                <div className="relative flex-1" style={{ height: `${rowHeight}px` }}>
                  {/* Render date cell backgrounds */}
                  <div className="flex absolute inset-0 z-0">
                    {daysInMonth.map((day) => (
                      <div
                        key={day.toISOString()}
                        className="w-16 flex-shrink-0 border-r"
                      />
                    ))}
                  </div>

                  {/* Render booking bars */}
                  {propertyBookings.map(({ booking, startDay, span, row, checkIn, checkOut }) => {
                  const nights = differenceInDays(checkOut, checkIn);

                  // Convert status to color (matching the month view colors)
                  let bgColor = '#3b82f6'; // blue-500 for confirmed
                  if (booking.status === 'pending') bgColor = '#eab308'; // yellow-500
                  else if (booking.status === 'completed' || booking.status === 'checked_out') bgColor = '#22c55e'; // green-500
                  else if (booking.status === 'cancelled' || booking.status === 'no_show') bgColor = '#9ca3af'; // gray-400
                  else if (booking.status === 'checked_in') bgColor = '#3b82f6'; // blue-500

                  return (
                    <HoverCard key={booking.id} openDelay={200}>
                      <HoverCardTrigger asChild>
                        <div
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          className="absolute cursor-pointer rounded px-2 py-1 text-xs text-white truncate hover:opacity-90 hover:shadow-md transition-all z-10"
                          style={{
                            left: `${startDay * DAY_WIDTH}px`,
                            width: `${span * DAY_WIDTH - 4}px`,
                            top: `${row * 28 + 8}px`,
                            height: '24px',
                            backgroundColor: bgColor,
                          }}
                        >
                          {booking.guest_name}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80" side="top">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-semibold">{booking.guest_name}</h4>
                              <p className="text-xs text-muted-foreground">{booking.phone}</p>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              booking.status === 'confirmed' || booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                              booking.status === 'completed' || booking.status === 'checked_out' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {booking.status}
                            </div>
                          </div>
                          <div className="border-t pt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Property:</span>
                              <span className="font-medium">{booking.properties.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Check-in:</span>
                              <span>{format(checkIn, 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Check-out:</span>
                              <span>{format(checkOut, 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Guests:</span>
                              <span>{booking.guests}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-muted-foreground">Total Price:</span>
                              <span>RM {booking.price.toFixed(2)}</span>
                            </div>
                          </div>
                          {booking.notes && (
                            <div className="border-t pt-2">
                              <p className="text-xs text-muted-foreground">Notes:</p>
                              <p className="text-sm">{booking.notes}</p>
                            </div>
                          )}
                          <div className="border-t pt-2">
                            <p className="text-xs text-muted-foreground">Click to view full details</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

        {/* Legend at the bottom */}
        <div className="flex gap-4 flex-wrap p-4 bg-muted/50 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
            <span className="text-sm">Confirmed / Checked In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-sm">Completed / Checked Out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9ca3af' }} />
            <span className="text-sm">Cancelled / No Show</span>
          </div>
        </div>
      </div>
    </div>
  );
}
