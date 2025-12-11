import { Card, CardContent } from '@/components/ui/card';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded bg-muted" />
          <div className="h-8 w-[200px] animate-pulse rounded bg-muted" />
          <div className="h-10 w-10 animate-pulse rounded bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-[200px] animate-pulse rounded bg-muted" />
      </div>

      {/* Calendar grid skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-muted">
          {WEEKDAYS.map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {Array.from({ length: 35 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[100px] md:min-h-[120px] p-2 border-b border-r last:border-r-0"
            >
              <div className="space-y-2">
                <div className="h-5 w-6 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
