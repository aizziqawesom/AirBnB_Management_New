'use client';

import { Suspense, useEffect, useState } from 'react';
import { InboxHeader } from '@/components/inbox/inbox-header';
import { InboxFilters } from '@/components/inbox/inbox-filters';
import { InboxThreadList } from '@/components/inbox/inbox-thread-list';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingThread, InboxFilters as InboxFiltersType, InboxStats } from '@/lib/types/inbox';

function InboxSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<BookingThread[]>([]);
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([]);
  const [stats, setStats] = useState<InboxStats | undefined>();
  const [filters, setFilters] = useState<InboxFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch inbox threads
        const threadsRes = await fetch('/api/inbox/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters }),
        });
        const threadsData = await threadsRes.json();
        setThreads(threadsData.threads || []);

        // Fetch properties for filter
        const propertiesRes = await fetch('/api/properties');
        const propertiesData = await propertiesRes.json();
        setProperties(propertiesData.properties || []);

        // Fetch stats
        const statsRes = await fetch('/api/inbox/stats');
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      } catch (error) {
        console.error('Error fetching inbox data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <InboxHeader stats={stats} />

      <InboxFilters properties={properties} onFiltersChange={setFilters} />

      <Suspense fallback={<InboxSkeleton />}>
        {isLoading ? <InboxSkeleton /> : <InboxThreadList threads={threads} />}
      </Suspense>
    </div>
  );
}
