import { TriggerCard } from './trigger-card';
import type { TriggerWithDetails } from '@/lib/types/trigger';

interface TriggersListProps {
  triggers: TriggerWithDetails[];
}

export function TriggersList({ triggers }: TriggersListProps) {
  // Group triggers by type
  const eventTriggers = triggers.filter(t => t.trigger_type === 'event');
  const timeBasedTriggers = triggers.filter(t => t.trigger_type === 'time_based');

  return (
    <div className="space-y-6">
      {eventTriggers.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Event-Based Triggers</h2>
            <p className="text-sm text-muted-foreground">
              Triggered automatically when booking status changes
            </p>
          </div>
          <div className="grid gap-4">
            {eventTriggers.map((trigger) => (
              <TriggerCard key={trigger.id} trigger={trigger} />
            ))}
          </div>
        </div>
      )}

      {timeBasedTriggers.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Time-Based Triggers</h2>
            <p className="text-sm text-muted-foreground">
              Triggered at specific times relative to check-in/out dates
            </p>
          </div>
          <div className="grid gap-4">
            {timeBasedTriggers.map((trigger) => (
              <TriggerCard key={trigger.id} trigger={trigger} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
