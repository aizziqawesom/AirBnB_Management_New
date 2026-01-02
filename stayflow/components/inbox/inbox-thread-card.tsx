'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, AlertCircle, Mail, MessageCircle } from 'lucide-react';
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

  // Get the latest message for preview
  const latestMessage = thread.messages[thread.messages.length - 1] || thread.messages[0];

  // Get unique channels used in this thread
  const channels = [...new Set(thread.messages.map(m => m.channel).filter(Boolean))];

  return (
    <Card
      className={`hover:bg-accent/50 transition-colors cursor-pointer ${
        thread.failed_count > 0 ? 'border-l-4 border-l-red-500' : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Avatar circle with channel icon */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              channels.includes('whatsapp')
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {channels.includes('whatsapp') ? (
                <MessageCircle className="h-5 w-5" />
              ) : (
                <Mail className="h-5 w-5" />
              )}
            </div>

            {/* Thread info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base">{thread.booking.guest_name}</h3>
                {thread.failed_count > 0 && (
                  <Badge variant="destructive" className="gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {thread.failed_count} failed
                  </Badge>
                )}
              </div>

              {/* Property and booking info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span>{thread.booking.property?.name || 'Unknown Property'}</span>

                {/* TODO: Add OTA badge when database column is added
                {thread.booking.ota_source && thread.booking.ota_source !== 'direct' && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary" className="capitalize text-xs h-5">
                      {thread.booking.ota_source.replace('_', '.')}
                    </Badge>
                  </>
                )}
                */}

                <span>•</span>
                <span>
                  {format(new Date(thread.booking.check_in), 'MMM d')} -{' '}
                  {format(new Date(thread.booking.check_out), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Message preview - only show when collapsed */}
              {!isExpanded && latestMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {latestMessage.subject}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Time and expand button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Channel badges */}
            <div className="flex items-center gap-1">
              {channels.includes('email') && (
                <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs h-6">
                  <Mail className="h-3 w-3" />
                  Email
                </Badge>
              )}
              {channels.includes('whatsapp') && (
                <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 text-xs h-6">
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp
                </Badge>
              )}
            </div>

            {/* Time and message count */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                {format(new Date(thread.latest_message_at), 'MMM d, h:mm a')}
              </div>
              <div className="text-xs text-muted-foreground">
                {thread.message_count} {thread.message_count === 1 ? 'msg' : 'msgs'}
              </div>
            </div>

            {/* Expand/collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
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
                    <div className="flex items-start gap-3">
                      {/* Channel icon circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.channel === 'email'
                          ? 'bg-blue-100 text-blue-700'
                          : message.channel === 'whatsapp'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {message.channel === 'email' ? (
                          <Mail className="h-4 w-4" />
                        ) : message.channel === 'whatsapp' ? (
                          <MessageCircle className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{message.subject}</span>

                            {/* Channel badge */}
                            {message.channel === 'email' ? (
                              <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                                <Mail className="h-3 w-3" />
                                Email
                              </Badge>
                            ) : message.channel === 'whatsapp' ? (
                              <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                                <MessageCircle className="h-3 w-3" />
                                WhatsApp
                              </Badge>
                            ) : null}

                            {/* Status badge */}
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
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
