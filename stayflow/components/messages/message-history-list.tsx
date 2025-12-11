import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SentMessageWithBooking } from '@/lib/types/sent-message';
import { format } from 'date-fns';

interface MessageHistoryListProps {
  messages: SentMessageWithBooking[];
}

export function MessageHistoryList({ messages }: MessageHistoryListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

function MessageCard({ message }: { message: SentMessageWithBooking }) {
  const statusColors = {
    sent: 'bg-green-500',
    failed: 'bg-red-500',
    pending: 'bg-yellow-500',
    bounced: 'bg-orange-500',
  };

  const statusColor = statusColors[message.status] || 'bg-gray-500';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{message.subject}</CardTitle>
              <Badge className={statusColor}>{message.status}</Badge>
            </div>
            <CardDescription>
              To: {message.recipient_name} ({message.recipient_email})
            </CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {message.sent_at
              ? format(new Date(message.sent_at), 'MMM d, yyyy h:mm a')
              : format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-2">
          {message.booking && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Booking:</span>
              <span className="text-muted-foreground">
                {message.booking.property?.name} - {message.booking.guest_name}
              </span>
            </div>
          )}
          {message.template && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Template ID:</span>
              <span className="text-muted-foreground text-xs font-mono">{message.template.id}</span>
            </div>
          )}
          {message.trigger && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Trigger:</span>
              <Badge variant="outline">
                {message.trigger.trigger_type === 'event' ? 'Event-Based' : 'Time-Based'}
              </Badge>
            </div>
          )}
          {message.provider_message_id && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Message ID:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {message.provider_message_id}
              </code>
            </div>
          )}
        </div>

        {message.error_message && (
          <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-sm text-destructive/80 mt-1">{message.error_message}</p>
            {message.retry_count > 0 && (
              <p className="text-xs text-destructive/60 mt-1">
                Retried {message.retry_count} time(s)
              </p>
            )}
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer font-medium hover:underline">
            View Message Content
          </summary>
          <div className="mt-2 p-3 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap text-xs">{message.body}</pre>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
