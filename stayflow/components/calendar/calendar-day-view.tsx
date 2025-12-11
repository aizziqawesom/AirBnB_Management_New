'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, isSameDay, differenceInDays } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { BookingWithProperty } from '@/lib/types/booking';

interface CalendarDayViewProps {
  currentDate: Date;
  bookings: BookingWithProperty[];
  isLoading: boolean;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function CalendarDayView({ currentDate, bookings, isLoading }: CalendarDayViewProps) {
  const router = useRouter();

  const dayBookings = useMemo(() => {
    const normalizedDate = new Date(currentDate);
    normalizedDate.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      return normalizedDate >= checkIn && normalizedDate <= checkOut;
    });
  }, [currentDate, bookings]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = isSameDay(currentDate, today);
  const weekday = WEEKDAYS[currentDate.getDay()];

  return (
    <div className="w-full space-y-4">
      {/* Legend */}
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

      {/* Day Header */}
      <div className={`border rounded-lg overflow-hidden ${
        isToday ? 'ring-2 ring-primary' : ''
      }`}>
        <div className={`p-6 text-center ${
          isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <div className="text-lg font-medium">{weekday}</div>
          <div className="text-4xl font-bold mt-2">
            {format(currentDate, 'd')}
          </div>
          <div className="text-sm mt-1 opacity-80">
            {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-24 bg-muted animate-pulse rounded" />
              <div className="h-24 bg-muted animate-pulse rounded" />
            </div>
          ) : dayBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No bookings for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                {dayBookings.length} {dayBookings.length === 1 ? 'Booking' : 'Bookings'}
              </h3>
              {dayBookings.map(booking => {
                let bgColor = '#3b82f6';
                if (booking.status === 'pending') bgColor = '#eab308';
                else if (booking.status === 'completed' || booking.status === 'checked_out') bgColor = '#22c55e';
                else if (booking.status === 'cancelled' || booking.status === 'no_show') bgColor = '#9ca3af';

                const checkInDate = new Date(booking.check_in);
                const checkOutDate = new Date(booking.check_out);
                const nights = differenceInDays(checkOutDate, checkInDate);

                return (
                  <HoverCard key={booking.id} openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                        style={{ borderLeftWidth: '4px', borderLeftColor: bgColor }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{booking.guest_name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {booking.properties.name}
                            </p>
                            <div className="flex gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Check-in: </span>
                                <span className="font-medium">{format(checkInDate, 'dd MMM')}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Check-out: </span>
                                <span className="font-medium">{format(checkOutDate, 'dd MMM')}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration: </span>
                                <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                              </div>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Guests: </span>
                                <span className="font-medium">{booking.guests}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-semibold">RM {booking.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`text-xs px-3 py-1 rounded-full ${
                            booking.status === 'confirmed' || booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            booking.status === 'completed' || booking.status === 'checked_out' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">Notes:</p>
                            <p className="text-sm mt-1">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="right">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Contact Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{booking.phone}</span>
                          </div>
                        </div>
                        <div className="border-t pt-2">
                          <p className="text-xs text-muted-foreground">Click to view full details and manage booking</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
