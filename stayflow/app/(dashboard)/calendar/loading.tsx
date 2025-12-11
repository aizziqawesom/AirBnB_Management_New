import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarLoading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>

          {/* View Switcher */}
          <Skeleton className="h-9 w-64" />
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap p-4 bg-muted/50 rounded-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="border rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div className="bg-muted grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="p-2 text-center border-r last:border-r-0">
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
            ))}
          </div>

          {/* Calendar Days Grid (5 rows × 7 columns = 35 days) */}
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[100px] md:min-h-[120px] p-2 border-b border-r last:border-r-0"
              >
                <div className="space-y-2">
                  <Skeleton className="h-6 w-6" />
                  {/* Randomly show some booking skeletons */}
                  {i % 3 === 0 && <Skeleton className="h-5 w-full" />}
                  {i % 5 === 0 && <Skeleton className="h-5 w-3/4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
