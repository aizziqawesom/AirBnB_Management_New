import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay
} from 'date-fns';
import type { BookingWithProperty, BookingStatus } from '@/lib/types/booking';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: BookingWithProperty[];
}

/**
 * Generate calendar grid for a given month
 * Returns array of 35 or 42 days (5 or 6 weeks) to fill the grid
 */
export function generateCalendarDays(year: number, month: number): Date[] {
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(new Date(year, month));

  // Get the start of the week containing the first day (Sunday)
  const calendarStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });

  // Get the end of the week containing the last day
  const calendarEnd = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  // Generate all days in the range
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Map bookings to calendar days
 * Each day gets an array of bookings that overlap with that day
 */
export function mapBookingsToCalendar(
  calendarDays: Date[],
  bookings: BookingWithProperty[],
  currentMonth: Date
): CalendarDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  return calendarDays.map(date => {
    // Normalize the date to remove time component
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const dayBookings = bookings.filter(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      // Check if this day falls within the booking range (inclusive)
      return normalizedDate >= checkIn && normalizedDate <= checkOut;
    });

    return {
      date: normalizedDate,
      isCurrentMonth: isSameMonth(date, currentMonth),
      isToday: isSameDay(date, today),
      bookings: dayBookings,
    };
  });
}

/**
 * Get booking status color for calendar display
 */
export function getBookingColor(status: BookingStatus): string {
  switch (status) {
    case 'confirmed':
    case 'checked_in':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'completed':
    case 'checked_out':
      return 'bg-green-500';
    case 'cancelled':
    case 'no_show':
      return 'bg-gray-400';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
