'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BookingThread } from '@/lib/types/inbox';

interface InboxThreadCardProps {
  thread: BookingThread;
}

export function InboxThreadCard({ thread }: InboxThreadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    sent: 'bg-green-500',
    failed: 'bg-red-500',
    pending: 'bg-yellow-500',
    bounced: 'bg-orange-500',
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{thread.booking.guest_name}</h3>
              {thread.failed_count > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {thread.failed_count} failed
                </Badge>
              )}
              <Badge variant="secondary">
                {thread.message_count} {thread.message_count === 1 ? 'message' : 'messages'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span>{thread.booking.property?.name || 'Unknown Property'}</span>
              <span>•</span>
              <span>
                {format(new Date(thread.booking.check_in), 'MMM d')} -{' '}
                {format(new Date(thread.booking.check_out), 'MMM d, yyyy')}
              </span>
              <span>•</span>
              <span className="capitalize">{thread.booking.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right text-sm text-muted-foreground">
              {format(new Date(thread.latest_message_at), 'MMM d, h:mm a')}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="border-t pt-3">
            {thread.messages
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .map((message) => {
                const statusColor = statusColors[message.status] || 'bg-gray-500';

                return (
                  <div
                    key={message.id}
                    className="mb-3 last:mb-0 p-3 rounded-md border bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.subject}</span>
                        <Badge className={statusColor}>{message.status}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {message.sent_at
                          ? format(new Date(message.sent_at), 'MMM d, h:mm a')
                          : format(new Date(message.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>To: {message.recipient_email}</div>
                      {message.trigger && (
                        <div className="flex items-center gap-1">
                          <span>Trigger:</span>
                          <Badge variant="outline" className="text-xs">
                            {message.trigger.trigger_type === 'event' ? 'Event-Based' : 'Time-Based'}
                          </Badge>
                        </div>
                      )}
                      {message.provider_message_id && (
                        <div>
                          Message ID:{' '}
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {message.provider_message_id}
                          </code>
                        </div>
                      )}
                    </div>

                    {message.error_message && (
                      <div className="mt-2 rounded-md bg-destructive/10 p-2 border border-destructive/20">
                        <p className="text-xs text-destructive font-medium">Error:</p>
                        <p className="text-xs text-destructive/80 mt-1">{message.error_message}</p>
                        {message.retry_count > 0 && (
                          <p className="text-xs text-destructive/60 mt-1">
                            Retried {message.retry_count} time(s)
                          </p>
                        )}
                      </div>
                    )}

                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer font-medium hover:underline">
                        View Message Content
                      </summary>
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <pre className="whitespace-pre-wrap text-xs">{message.body}</pre>
                      </div>
                    </details>
                  </div>
                );
              })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
