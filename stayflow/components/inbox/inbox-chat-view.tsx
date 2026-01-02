'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Mail, MessageCircle, Info, Paperclip, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BookingThread } from '@/lib/types/inbox';

interface InboxChatViewProps {
  thread: BookingThread | null;
}

export function InboxChatView({ thread }: InboxChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'whatsapp'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No conversation selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a conversation from the list to view messages
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    sent: 'bg-green-500',
    failed: 'bg-red-500',
    pending: 'bg-yellow-500',
    bounced: 'bg-orange-500',
  };

  // Get guest initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header - fixed */}
      <div className="border-b px-6 py-4 bg-background flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Guest avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
              {getInitials(thread.booking.guest_name)}
            </div>
            <div>
              <h2 className="font-semibold text-base">{thread.booking.guest_name}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{thread.booking.property?.name || 'Unknown Property'}</span>
                <span>•</span>
                <span>
                  {format(new Date(thread.booking.check_in), 'MMM d')} -{' '}
                  {format(new Date(thread.booking.check_out), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
            <MessageCircle className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
        </div>
      </div>

      {/* Chat messages - scrollable area */}
      <div className="flex-1 p-6 space-y-6 bg-muted/20">
        {thread.messages
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((message) => {
            const statusColor = statusColors[message.status] || 'bg-gray-500';
            const isEmail = message.channel === 'email';
            const isWhatsApp = message.channel === 'whatsapp';

            return (
              <div key={message.id} className="flex gap-3 group items-start">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                  isEmail
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isEmail ? (
                    <Mail className="h-5 w-5" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                </div>

                {/* Message content */}
                <div className="flex-1 space-y-1">
                  {/* Message timestamp and info */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {message.sent_at
                        ? format(new Date(message.sent_at), 'MMM d, h:mm a')
                        : format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Subject:</span> {message.subject}
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {message.recipient_email}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{' '}
                            <Badge className={`${statusColor} text-xs`}>{message.status}</Badge>
                          </div>
                          <div>
                            <span className="font-medium">Sent:</span>{' '}
                            {message.sent_at
                              ? format(new Date(message.sent_at), 'MMM d, yyyy h:mm a')
                              : 'Not sent yet'}
                          </div>
                          {message.trigger && (
                            <div>
                              <span className="font-medium">Trigger:</span>{' '}
                              {message.trigger.trigger_type === 'event' ? 'Event-Based' : 'Time-Based'}
                            </div>
                          )}
                          {message.provider_message_id && (
                            <div>
                              <span className="font-medium">Message ID:</span>{' '}
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {message.provider_message_id}
                              </code>
                            </div>
                          )}
                          {message.error_message && (
                            <div className="pt-2 border-t">
                              <span className="font-medium text-destructive">Error:</span>
                              <p className="text-destructive/80 mt-1">{message.error_message}</p>
                              {message.retry_count > 0 && (
                                <p className="text-destructive/60 mt-1">
                                  Retried {message.retry_count} time(s)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Message bubble - actual message content */}
                  <div className={`
                    rounded-lg p-3 max-w-[85%] text-sm
                    ${message.status === 'failed'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-white border border-border'
                    }
                  `}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.body}
                    </div>

                    {/* Error message if failed */}
                    {message.status === 'failed' && message.error_message && (
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <p className="text-xs text-red-700 font-medium">Failed to send</p>
                        <p className="text-xs text-red-600 mt-0.5">{message.error_message}</p>
                      </div>
                    )}
                  </div>

                  {/* Channel badge */}
                  <div className="flex items-center gap-2 mt-1">
                    {isEmail ? (
                      <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs h-5 px-1.5">
                        <Mail className="h-2.5 w-2.5" />
                        Via Email
                      </Badge>
                    ) : isWhatsApp ? (
                      <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 text-xs h-5 px-1.5">
                        <MessageCircle className="h-2.5 w-2.5" />
                        Via WhatsApp
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Message input box - fixed at bottom */}
      <div className="border-t bg-background p-4 flex-shrink-0 sticky bottom-0 z-10">
        <div className="space-y-3">
          {/* Input area */}
          <div className="relative">
            <Textarea
              placeholder="Respond message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled
            />
          </div>

          {/* Options row */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <Send className="h-4 w-4 text-muted-foreground" />
            </div>

            <Select
              value={selectedChannel}
              onValueChange={(value: 'email' | 'whatsapp') => setSelectedChannel(value)}
              disabled
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Via Email</SelectItem>
                <SelectItem value="whatsapp">Via WhatsApp</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
              disabled
            >
              <SelectTrigger className="w-[220px] h-8 text-xs">
                <SelectValue placeholder="Select a template message" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Welcome Message</SelectItem>
                <SelectItem value="template2">Check-in Instructions</SelectItem>
                <SelectItem value="template3">Check-out Reminder</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-xs text-muted-foreground ml-auto">
              (Message sending coming soon)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
