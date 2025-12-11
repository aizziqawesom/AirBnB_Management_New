'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInDays } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { BookingWithProperty } from '@/lib/types/booking';

interface CalendarWeekViewProps {
  currentDate: Date;
  bookings: BookingWithProperty[];
  isLoading: boolean;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function CalendarWeekView({ currentDate, bookings, isLoading }: CalendarWeekViewProps) {
  const router = useRouter();

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const mappedBookings = useMemo(() => {
    return weekDays.map(day => {
      const dayBookings = bookings.filter(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        const normalizedDay = new Date(day);
        normalizedDay.setHours(0, 0, 0, 0);

        return normalizedDay >= checkIn && normalizedDay <= checkOut;
      });

      return { day, bookings: dayBookings };
    });
  }, [weekDays, bookings]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

      {/* Week Grid */}
      <div className="border rounded-lg overflow-hidden">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {mappedBookings.map(({ day, bookings: dayBookings }, index) => {
            const isToday = isSameDay(day, today);

            return (
              <div
                key={index}
                className={`border-r last:border-r-0 min-h-[400px] ${
                  isToday ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                }`}
              >
                {/* Day Header */}
                <div className={`p-3 border-b text-center ${
                  isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <div className="text-sm font-medium">{WEEKDAYS[index]}</div>
                  <div className={`text-2xl font-bold ${
                    isToday ? '' : 'text-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>

                {/* Bookings */}
                <div className="p-2 space-y-2">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-16 bg-muted animate-pulse rounded" />
                    </div>
                  ) : (
                    dayBookings.map(booking => {
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
                              style={{ backgroundColor: bgColor }}
                              className="p-2 rounded cursor-pointer hover:opacity-90 hover:shadow-md transition-all"
                            >
                              <div className="text-xs text-white font-medium truncate">
                                {booking.guest_name}
                              </div>
                              <div className="text-xs text-white/80 truncate">
                                {booking.properties.name}
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
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
