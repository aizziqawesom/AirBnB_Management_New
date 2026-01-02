import { getTriggerById } from '@/lib/actions/triggers';
import { getTemplates } from '@/lib/actions/messages';
import { getProperties } from '@/lib/actions/properties';
import { TriggerEditForm } from '@/components/triggers/trigger-edit-form';
import { redirect } from 'next/navigation';

export default async function EditTriggerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15+
  const { id } = await params;

  const [triggerResult, templatesResult, propertiesResult] = await Promise.all([
    getTriggerById(id),
    getTemplates(),
    getProperties(),
  ]);

  // Extract data from results
  const trigger = triggerResult;
  const templates = templatesResult?.data || [];
  const properties = propertiesResult?.data || [];

  if (!trigger) {
    redirect('/messages/triggers');
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Trigger</h1>
        <p className="text-sm text-gray-600 mt-1">
          Update trigger settings for automated messages
        </p>
      </div>
      <TriggerEditForm
        trigger={trigger}
        templates={templates}
        properties={properties}
      />
    </div>
  );
}
