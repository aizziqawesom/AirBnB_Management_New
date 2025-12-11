import { Suspense } from 'react';
import { CalendarView } from '@/components/calendar/calendar-view';
import { CalendarSkeleton } from '@/components/calendar/calendar-skeleton';

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage bookings in a calendar view
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarView />
        </Suspense>
      </div>
    </div>
  );
}
