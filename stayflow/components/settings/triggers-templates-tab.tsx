'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TriggersList } from '@/components/triggers/triggers-list';
import { MessageTemplatesListClient } from '@/components/messages/message-templates-list-client';
import { Skeleton } from '@/components/ui/skeleton';
import type { TriggerWithDetails } from '@/lib/types/trigger';
import type { MessageTemplate } from '@/lib/types/message';

function TriggersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function TemplatesListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

export function TriggersTemplatesTab() {
  const [triggers, setTriggers] = useState<TriggerWithDetails[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingTriggers, setIsLoadingTriggers] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  useEffect(() => {
    async function fetchTriggers() {
      try {
        const response = await fetch('/api/triggers');
        const data = await response.json();
        setTriggers(data.triggers || []);
      } catch (error) {
        console.error('Error fetching triggers:', error);
      } finally {
        setIsLoadingTriggers(false);
      }
    }

    async function fetchTemplates() {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    }

    fetchTriggers();
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-8">
      {/* Triggers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Automated Triggers
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set up automated email notifications for bookings
            </p>
          </div>
          <Button asChild>
            <Link href="/messages/triggers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trigger
            </Link>
          </Button>
        </div>
        {isLoadingTriggers ? (
          <TriggersListSkeleton />
        ) : triggers.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No triggers yet</CardTitle>
              <CardDescription>
                Create your first trigger to start automating email notifications
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <TriggersList triggers={triggers} />
        )}
      </div>

      {/* Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Message Templates</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create reusable message templates with variables
            </p>
          </div>
          <Button asChild>
            <Link href="/messages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Link>
          </Button>
        </div>
        {isLoadingTemplates ? (
          <TemplatesListSkeleton />
        ) : templates.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No templates yet</CardTitle>
              <CardDescription>
                Create your first template to use in automated messages
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <MessageTemplatesListClient templates={templates} />
        )}
      </div>
    </div>
  );
}
