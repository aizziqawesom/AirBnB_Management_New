'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, differenceInDays, isSameDay } from 'date-fns';
import { generateCalendarDays, mapBookingsToCalendar, truncateText } from '@/lib/utils/calendar';
import { CalendarDayCell } from './calendar-day-cell';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { BookingWithProperty } from '@/lib/types/booking';

interface CalendarGridProps {
  currentDate: Date;
  bookings: BookingWithProperty[];
  isLoading: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BookingSpan {
  booking: BookingWithProperty;
  startIndex: number;
  span: number;
  row: number;
}

export function CalendarGrid({ currentDate, bookings, isLoading }: CalendarGridProps) {
  const router = useRouter();

  const calendarDays = useMemo(
    () => generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const mappedDays = useMemo(
    () => mapBookingsToCalendar(calendarDays, bookings, currentDate),
    [calendarDays, bookings, currentDate]
  );

  // Calculate booking spans for visual rendering with stacking logic
  const bookingSpans = useMemo(() => {
    const spans: (BookingSpan & { stackLevel: number })[] = [];
    const processedBookings = new Set<string>();

    calendarDays.forEach((day, dayIndex) => {
      const dayBookings = mappedDays[dayIndex].bookings;

      dayBookings.forEach(booking => {
        // Only process each booking once (at its start)
        if (processedBookings.has(booking.id)) return;

        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        // Check if this day is the booking's start day
        if (isSameDay(day, checkIn)) {
          // Calculate how many days this booking spans in the visible calendar
          let span = 1;
          const row = Math.floor(dayIndex / 7);

          for (let i = dayIndex + 1; i < calendarDays.length; i++) {
            const currentDay = calendarDays[i];
            const currentRow = Math.floor(i / 7);

            // Stop if we hit a new week or go past check-out
            if (currentRow !== row || currentDay > checkOut) break;
            span++;
          }

          // Calculate stack level (how many bookings are already on this row at this position)
          const overlappingBookings = spans.filter(s => {
            if (s.row !== row) return false;
            const sEnd = s.startIndex + s.span - 1;
            const thisEnd = dayIndex + span - 1;
            return !(sEnd < dayIndex || s.startIndex > thisEnd);
          });

          spans.push({
            booking,
            startIndex: dayIndex,
            span,
            row,
            stackLevel: overlappingBookings.length,
          });

          processedBookings.add(booking.id);
        }
      });
    });

    return spans;
  }, [calendarDays, mappedDays, bookings]);

  return (
    <div className="w-full min-w-[800px] space-y-4">
      {/* Legend at the top */}
      <div className="flex gap-4 flex-wrap p-4 bg-muted/50 rounded-lg">
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

      <div className="border rounded-lg overflow-hidden" style={{ display: 'block' }}>
      {/* Weekday Headers */}
      <div className="bg-muted" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {mappedDays.map((day, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;

          // Find bookings that start on this day
          const dayStartBookings = bookingSpans.filter(
            span => span.startIndex === index
          );

          return (
            <div key={`${format(day.date, 'yyyy-MM-dd')}-${index}`} style={{ position: 'relative' }}>
              <CalendarDayCell
                day={day}
                isLoading={isLoading}
                showBookings={false}
              />

              {/* Render booking bars that start on this day */}
              <div style={{ position: 'absolute', top: '32px', left: 0, right: 0, zIndex: 10 }}>
                {dayStartBookings.map((span) => {
                  const { booking, span: daySpan, stackLevel } = span;

                  // Get color based on status
                  let bgColor = '#3b82f6'; // blue-500
                  if (booking.status === 'pending') bgColor = '#eab308';
                  else if (booking.status === 'completed' || booking.status === 'checked_out') bgColor = '#22c55e';
                  else if (booking.status === 'cancelled' || booking.status === 'no_show') bgColor = '#9ca3af';
                  else if (booking.status === 'checked_in') bgColor = '#3b82f6';

                  const checkInDate = new Date(booking.check_in);
                  const checkOutDate = new Date(booking.check_out);
                  const nights = differenceInDays(checkOutDate, checkInDate);

                  // Calculate width based on span
                  const width = `calc(${daySpan * 100}% + ${(daySpan - 1) * 1}px)`;

                  return (
                    <HoverCard key={`booking-${booking.id}`} openDelay={200}>
                      <HoverCardTrigger asChild>
                        <div
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          style={{
                            position: 'absolute',
                            top: `${stackLevel * 24}px`,
                            left: '4px',
                            width: width,
                            backgroundColor: bgColor,
                            borderRadius: '4px',
                            padding: '4px 6px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s, transform 0.2s',
                          }}
                          className="hover:opacity-90 hover:shadow-md"
                        >
                          <div className="text-xs text-white truncate font-medium">
                            {truncateText(booking.guest_name, daySpan * 8)}
                          </div>
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
                              <span>{format(checkInDate, 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Check-out:</span>
                              <span>{format(checkOutDate, 'dd MMM yyyy')}</span>
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
    </div>
    </div>
  );
}
