import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageHistoryList } from '@/components/messages/message-history-list';
import { getSentMessages, getMessageStats } from '@/lib/services/sent-messages';

export default async function MessageHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Message History</h1>
        <p className="text-muted-foreground mt-2">
          View all sent email notifications
        </p>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <MessageStats />
      </Suspense>

      <Suspense fallback={<HistoryLoadingSkeleton />}>
        <MessageHistoryContent />
      </Suspense>
    </div>
  );
}

async function MessageStats() {
  const stats = await getMessageStats();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Sent</CardDescription>
          <CardTitle className="text-3xl">{stats.total}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Successful</CardDescription>
          <CardTitle className="text-3xl text-green-600">{stats.sent}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Failed</CardDescription>
          <CardTitle className="text-3xl text-red-600">{stats.failed}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

async function MessageHistoryContent() {
  const messages = await getSentMessages();

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No messages yet</CardTitle>
          <CardDescription>
            Messages will appear here once triggers start sending emails
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <MessageHistoryList messages={messages} />;
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16 mt-2" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function HistoryLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
