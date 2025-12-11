'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getBookingColor, truncateText } from '@/lib/utils/calendar';
import type { CalendarDay } from '@/lib/utils/calendar';

interface CalendarDayCellProps {
  day: CalendarDay;
  isLoading: boolean;
  showBookings?: boolean;
}

export function CalendarDayCell({ day, isLoading, showBookings = true }: CalendarDayCellProps) {
  const { date, isCurrentMonth, isToday, bookings } = day;
  const hasBookings = bookings.length > 0;

  return (
    <div
      className={cn(
        'min-h-[100px] md:min-h-[120px] p-2 border-b border-r last:border-r-0',
        !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
        isToday && 'ring-2 ring-primary ring-inset',
        hasBookings && isCurrentMonth && 'bg-blue-50 dark:bg-blue-950/20'
      )}
    >
      {/* Day Number */}
      <div className="flex justify-between items-start mb-1">
        <span
          className={cn(
            'text-sm font-medium',
            isToday &&
              'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs'
          )}
        >
          {format(date, 'd')}
        </span>
        {hasBookings && (
          <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">
            {bookings.length}
          </span>
        )}
      </div>

      {/* Bookings - only show if showBookings is true */}
      {showBookings && (
        <>
          {isLoading ? (
            <div className="space-y-1">
              <div className="h-5 bg-muted animate-pulse rounded" />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
