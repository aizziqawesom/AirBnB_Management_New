'use client';

import { Suspense, useEffect, useState } from 'react';
import { InboxFilters } from '@/components/inbox/inbox-filters';
import { InboxConversationList } from '@/components/inbox/inbox-conversation-list';
import { InboxChatView } from '@/components/inbox/inbox-chat-view';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingThread, InboxFilters as InboxFiltersType, InboxStats } from '@/lib/types/inbox';

function InboxSkeleton() {
  return (
    <div className="flex h-[calc(100vh-12rem)] gap-0">
      {/* Left sidebar skeleton */}
      <div className="w-96 border-r space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      {/* Right chat skeleton */}
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<BookingThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<BookingThread[]>([]);
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([]);
  const [stats, setStats] = useState<InboxStats | undefined>();
  const [filters, setFilters] = useState<InboxFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

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

  // Apply client-side filtering
  useEffect(() => {
    const filtered = threads.map(thread => {
      let filteredMessages = thread.messages;

      // Apply status filter
      if (filters.status) {
        filteredMessages = filteredMessages.filter(
          msg => msg.status === filters.status
        );
      }

      // Apply channel filter
      if (filters.channel) {
        filteredMessages = filteredMessages.filter(
          msg => msg.channel === filters.channel
        );
      }

      // Only show thread if it has at least one message after filtering
      if (filteredMessages.length === 0) {
        return null;
      }

      return {
        ...thread,
        messages: filteredMessages,
        message_count: filteredMessages.length,
        failed_count: filteredMessages.filter(m => m.status === 'failed').length,
      };
    }).filter(Boolean) as BookingThread[];

    setFilteredThreads(filtered);

    // Auto-select first thread if none selected
    if (filtered.length > 0 && !selectedThreadId) {
      setSelectedThreadId(filtered[0].booking_id);
    }

    // Clear selection if selected thread is filtered out
    if (selectedThreadId && !filtered.find(t => t.booking_id === selectedThreadId)) {
      setSelectedThreadId(filtered.length > 0 ? filtered[0].booking_id : null);
    }
  }, [threads, filters, selectedThreadId]);

  const selectedThread = filteredThreads.find(t => t.booking_id === selectedThreadId) || null;

  return (
    <Suspense fallback={<InboxSkeleton />}>
      {isLoading ? (
        <InboxSkeleton />
      ) : (
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
          {/* Compact Header with Stats and Filters */}
          <div className="flex-shrink-0 space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Inbox</h1>
                <p className="text-sm text-muted-foreground">View your automated message conversations</p>
              </div>
            </div>

            {/* Stats - compact single row */}
            {stats && (
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-card border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Total Threads</div>
                  <div className="text-xl font-bold">{stats.total_threads}</div>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">With Failures</div>
                  <div className="text-xl font-bold text-red-600">{stats.threads_with_failures}</div>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Total Sent</div>
                  <div className="text-xl font-bold">{stats.total_messages_sent}</div>
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Last 7 Days</div>
                  <div className="text-xl font-bold">{stats.messages_last_7_days}</div>
                </div>
              </div>
            )}

            <InboxFilters properties={properties} onFiltersChange={setFilters} />
          </div>

          {/* Two-column layout - takes remaining space */}
          <div className="flex flex-1 border rounded-lg overflow-hidden bg-background min-h-0">
            {/* Left column - Conversation list */}
            <div className="w-96 flex-shrink-0 border-r overflow-y-auto">
              <InboxConversationList
                threads={filteredThreads}
                selectedThreadId={selectedThreadId}
                onSelectThread={setSelectedThreadId}
              />
            </div>

            {/* Right column - Chat view */}
            <div className="flex-1 overflow-y-auto">
              <InboxChatView thread={selectedThread} />
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
