'use client';

import { useMemo } from 'react';
import { InboxThreadCard } from './inbox-thread-card';
import type { BookingThread, InboxFilters } from '@/lib/types/inbox';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

interface InboxThreadListProps {
  threads: BookingThread[];
  filters: InboxFilters;
}

export function InboxThreadList({ threads, filters }: InboxThreadListProps) {
  // Filter threads client-side based on current filters
  const filteredThreads = useMemo(() => {
    return threads.map(thread => {
      // Filter messages within each thread
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

      // Return thread with filtered messages
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
    }).filter(Boolean) as BookingThread[];  // Remove null threads
  }, [threads, filters]);

  if (filteredThreads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {threads.length === 0 ? 'No messages yet' : 'No messages found'}
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {threads.length === 0
              ? "When you send automated emails to your guests, they'll appear here grouped by booking."
              : 'No messages match your current filters. Try adjusting your filter criteria.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredThreads.map((thread) => (
        <InboxThreadCard key={thread.booking_id} thread={thread} />
      ))}
    </div>
  );
}
