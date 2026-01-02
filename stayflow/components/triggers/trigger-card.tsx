import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleTriggerButton } from './toggle-trigger-button';
import { DeleteTriggerButton } from './delete-trigger-button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import type { TriggerWithDetails } from '@/lib/types/trigger';

interface TriggerCardProps {
  trigger: TriggerWithDetails;
}

export function TriggerCard({ trigger }: TriggerCardProps) {
  const description = getTriggerDescription(trigger);
  const propertyNames = trigger.properties && trigger.properties.length > 0
    ? trigger.properties.map(p => p.name).join(', ')
    : 'All properties';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>{trigger.template?.name || 'Unknown Template'}</CardTitle>
              {!trigger.is_active && (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/messages/triggers/${trigger.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <ToggleTriggerButton
              triggerId={trigger.id}
              isActive={trigger.is_active}
            />
            <DeleteTriggerButton
              triggerId={trigger.id}
              triggerName={trigger.template?.name || 'this trigger'}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Properties:</span>
            <span className="text-muted-foreground">{propertyNames}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Recipient:</span>
            <Badge variant="outline">{trigger.template?.recipient_type || 'Unknown'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Channels:</span>
            <div className="flex gap-1">
              {trigger.email_enabled && (
                <Badge variant="default" className="bg-blue-500">
                  Email
                </Badge>
              )}
              {trigger.whatsapp_enabled && (
                <Badge variant="default" className="bg-green-500">
                  WhatsApp
                </Badge>
              )}
              {!trigger.email_enabled && !trigger.whatsapp_enabled && (
                <Badge variant="outline" className="text-gray-400">
                  No channels
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTriggerDescription(trigger: TriggerWithDetails): string {
  if (trigger.trigger_type === 'event') {
    const eventLabels: Record<string, string> = {
      booking_created: 'When booking is created',
      booking_confirmed: 'When booking is confirmed',
      booking_cancelled: 'When booking is cancelled',
      booking_checked_in: 'When guest checks in',
      booking_checked_out: 'When guest checks out',
      booking_completed: 'When booking is completed',
      booking_no_show: 'When guest is a no-show',
    };
    return eventLabels[trigger.event_type || ''] || 'Unknown event';
  }

  // Time-based trigger
  const value = trigger.time_offset_value || 0;
  const unit = trigger.time_offset_unit === 'hours' ? 'hour' : 'day';
  const unitPlural = value === 1 ? unit : `${unit}s`;

  const referenceLabels: Record<string, string> = {
    before_checkin: 'before check-in',
    after_checkin: 'after check-in',
    before_checkout: 'before check-out',
    after_checkout: 'after check-out',
  };
  const reference = referenceLabels[trigger.time_reference || ''] || 'unknown time';

  const sendTime = trigger.send_time ? trigger.send_time.substring(0, 5) : '00:00';

  return `${value} ${unitPlural} ${reference} at ${sendTime}`;
}
