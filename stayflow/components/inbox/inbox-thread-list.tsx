import { InboxThreadCard } from './inbox-thread-card';
import type { BookingThread } from '@/lib/types/inbox';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

interface InboxThreadListProps {
  threads: BookingThread[];
}

export function InboxThreadList({ threads }: InboxThreadListProps) {
  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            When you send automated emails to your guests, they'll appear here grouped by booking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <InboxThreadCard key={thread.booking_id} thread={thread} />
      ))}
    </div>
  );
}
