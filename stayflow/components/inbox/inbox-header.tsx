import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InboxStats } from '@/lib/types/inbox';

interface InboxHeaderProps {
  stats?: InboxStats;
}

export function InboxHeader({ stats }: InboxHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          {stats ? (
            <>
              {stats.total_threads} {stats.total_threads === 1 ? 'conversation' : 'conversations'}
              {' • '}
              {stats.messages_last_7_days} messages in last 7 days
            </>
          ) : (
            'View your automated message conversations'
          )}
        </p>
      </div>
      <Button variant="outline" size="icon" asChild>
        <Link href="/messages/settings">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Link>
      </Button>
    </div>
  );
}
