'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { updateTriggerFull } from '@/lib/actions/triggers';
import type { MessageTrigger } from '@/lib/types/trigger';
import type { MessageTemplate } from '@/lib/types/message';
import type { Property } from '@/lib/types/property';

interface TriggerEditFormProps {
  trigger: MessageTrigger & {
    trigger_property_assignments?: { property_id: string }[];
  };
  templates: MessageTemplate[];
  properties: Property[];
}

export function TriggerEditForm({ trigger, templates, properties }: TriggerEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(trigger.name);
  const [templateId, setTemplateId] = useState(trigger.template_id);
  const [emailEnabled, setEmailEnabled] = useState(trigger.email_enabled ?? true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(trigger.whatsapp_enabled ?? false);
  const [isActive, setIsActive] = useState(trigger.is_active);
  const [selectedProperties, setSelectedProperties] = useState<string[]>(
    trigger.trigger_property_assignments?.map(a => a.property_id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateTriggerFull(
        trigger.id,
        {
          name,
          template_id: templateId,
          email_enabled: emailEnabled,
          whatsapp_enabled: whatsappEnabled,
          is_active: isActive,
        },
        selectedProperties
      );

      if (result.success) {
        toast.success('Trigger updated successfully');
        router.push('/messages/triggers');
      } else {
        toast.error('Error', {
          description: result.error || 'Failed to update trigger',
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Trigger</CardTitle>
        <CardDescription>
          Update trigger settings. Changes only affect future bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trigger Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Trigger Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Booking Confirmation Email"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Message Template</Label>
            <select
              id="template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Toggles */}
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium text-sm">Message Channels</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-enabled">Send via Email</Label>
                <p className="text-xs text-gray-500">
                  Send messages to guest email address
                </p>
              </div>
              <Checkbox
                id="email-enabled"
                checked={emailEnabled}
                onCheckedChange={(checked) => setEmailEnabled(checked as boolean)}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="whatsapp-enabled">Send via WhatsApp</Label>
                <p className="text-xs text-gray-500">
                  Send messages to guest phone number
                </p>
              </div>
              <Checkbox
                id="whatsapp-enabled"
                checked={whatsappEnabled}
                onCheckedChange={(checked) => setWhatsappEnabled(checked as boolean)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between border rounded-md p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is-active">Active</Label>
              <p className="text-xs text-gray-500">
                Enable or disable this trigger
              </p>
            </div>
            <Checkbox
              id="is-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
              disabled={isSubmitting}
            />
          </div>

          {/* Property Selection */}
          <div className="space-y-3">
            <Label>Properties</Label>
            <p className="text-xs text-gray-500">
              Select which properties this trigger applies to (leave empty for all properties)
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {properties.map(property => (
                <label
                  key={property.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => handlePropertyToggle(property.id)}
                    className="rounded border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm">{property.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/messages/triggers')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
