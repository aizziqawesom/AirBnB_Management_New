'use client';

import { useState } from 'react';
import { Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toggleTrigger } from '@/lib/actions/triggers';

interface ToggleTriggerButtonProps {
  triggerId: string;
  isActive: boolean;
}

export function ToggleTriggerButton({ triggerId, isActive }: ToggleTriggerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);

    try {
      const result = await toggleTrigger(triggerId, !isActive);

      if (result.success) {
        toast.success(isActive ? 'Trigger deactivated' : 'Trigger activated');
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
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      title={isActive ? 'Deactivate trigger' : 'Activate trigger'}
    >
      {isActive ? (
        <Power className="h-4 w-4 text-green-600" />
      ) : (
        <PowerOff className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
