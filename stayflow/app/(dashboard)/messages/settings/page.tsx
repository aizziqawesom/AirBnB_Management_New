'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriggersTemplatesTab } from '@/components/settings/triggers-templates-tab';
import { TestEmailTab } from '@/components/settings/test-email-tab';
import { EmailConfigTab } from '@/components/settings/email-config-tab';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'triggers-templates';

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Settings</h1>
          <p className="text-muted-foreground">
            Configure triggers, templates, and email preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="triggers-templates" asChild>
            <Link href="/messages/settings?tab=triggers-templates">
              Triggers & Templates
            </Link>
          </TabsTrigger>
          <TabsTrigger value="test-email" asChild>
            <Link href="/messages/settings?tab=test-email">
              Test Email
            </Link>
          </TabsTrigger>
          <TabsTrigger value="email-config" asChild>
            <Link href="/messages/settings?tab=email-config">
              Email Configuration
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triggers-templates" className="mt-6">
          <TriggersTemplatesTab />
        </TabsContent>

        <TabsContent value="test-email" className="mt-6">
          <TestEmailTab />
        </TabsContent>

        <TabsContent value="email-config" className="mt-6">
          <EmailConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
