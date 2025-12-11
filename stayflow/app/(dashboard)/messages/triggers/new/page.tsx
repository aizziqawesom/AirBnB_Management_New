import { TriggerForm } from '@/components/triggers/trigger-form';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import { redirect } from 'next/navigation';

export default async function NewTriggerPage() {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    redirect('/setup');
  }

  // Fetch templates
  const { data: templates } = await supabase
    .from('message_templates')
    .select('id, title, recipient')
    .eq('organization_id', organization.id)
    .order('title');

  // Fetch properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name')
    .eq('organization_id', organization.id)
    .order('name');

  if (!templates || templates.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Trigger</h1>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            You need to create at least one message template before you can create triggers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Trigger</h1>
        <p className="text-muted-foreground mt-2">
          Set up automated email notifications for your bookings
        </p>
      </div>

      <TriggerForm
        templates={templates}
        properties={properties || []}
      />
    </div>
  );
}
