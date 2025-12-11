import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Zap, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageTemplatesList } from '@/components/messages/message-templates-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function MessageTemplatesListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage templates and automated triggers
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription className="mt-2">
                  Create reusable message templates with variables
                </CardDescription>
              </div>
            </div>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/messages/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Automated Triggers
                </CardTitle>
                <CardDescription className="mt-2">
                  Set up automated email notifications for bookings
                </CardDescription>
              </div>
            </div>
            <div className="pt-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/messages/triggers">
                  View Triggers
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Message History
                </CardTitle>
                <CardDescription className="mt-2">
                  View all sent email notifications
                </CardDescription>
              </div>
            </div>
            <div className="pt-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/messages/history">
                  View History
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Templates List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Templates</h2>
        </div>
        <Suspense fallback={<MessageTemplatesListSkeleton />}>
          <MessageTemplatesList />
        </Suspense>
      </div>
    </div>
  );
}
