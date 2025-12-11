import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TriggersList } from '@/components/triggers/triggers-list';
import { getTriggers } from '@/lib/services/triggers';

export default async function TriggersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Triggers</h1>
          <p className="text-muted-foreground mt-2">
            Automate email notifications based on booking events or scheduled times
          </p>
        </div>
        <Button asChild>
          <Link href="/messages/triggers/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Trigger
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TriggersLoadingSkeleton />}>
        <TriggersContent />
      </Suspense>
    </div>
  );
}

async function TriggersContent() {
  const triggers = await getTriggers();

  if (triggers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No triggers yet</CardTitle>
          <CardDescription>
            Create your first trigger to start automating email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/messages/triggers/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Trigger
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <TriggersList triggers={triggers} />;
}

function TriggersLoadingSkeleton() {
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
