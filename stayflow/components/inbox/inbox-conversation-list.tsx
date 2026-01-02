'use client';

import { format } from 'date-fns';
import { Mail, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BookingThread } from '@/lib/types/inbox';

interface InboxConversationListProps {
  threads: BookingThread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export function InboxConversationList({
  threads,
  selectedThreadId,
  onSelectThread,
}: InboxConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Conversation list */}
      <div className="flex-1">
        {threads.map((thread) => {
          const latestMessage = thread.messages[thread.messages.length - 1] || thread.messages[0];
          const channels = [...new Set(thread.messages.map(m => m.channel).filter(Boolean))];
          const isSelected = selectedThreadId === thread.booking_id;

          return (
            <div
              key={thread.booking_id}
              onClick={() => onSelectThread(thread.booking_id)}
              className={`
                flex items-start gap-3 p-4 border-b cursor-pointer transition-colors
                ${isSelected ? 'bg-accent border-l-4 border-l-primary' : 'hover:bg-accent/50'}
                ${thread.failed_count > 0 && !isSelected ? 'border-l-4 border-l-red-500' : ''}
              `}
            >
              {/* Channel avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                channels.includes('whatsapp')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {channels.includes('whatsapp') ? (
                  <MessageCircle className="h-6 w-6" />
                ) : (
                  <Mail className="h-6 w-6" />
                )}
              </div>

              {/* Conversation info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{thread.booking.guest_name}</h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(thread.latest_message_at), 'MMM d')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="truncate">{thread.booking.property?.name || 'Unknown Property'}</span>
                  {/* TODO: Add OTA source badge when database column is added
                  {thread.booking.ota_source && thread.booking.ota_source !== 'direct' && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="capitalize text-xs h-4 px-1">
                        {thread.booking.ota_source.replace('_', '.')}
                      </Badge>
                    </>
                  )}
                  */}
                </div>

                {/* Message preview */}
                {latestMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {latestMessage.subject}
                  </p>
                )}

                {/* Status badges */}
                <div className="flex items-center gap-1 mt-2">
                  {channels.includes('email') && (
                    <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs h-5 px-1.5">
                      <Mail className="h-2.5 w-2.5" />
                      Email
                    </Badge>
                  )}
                  {channels.includes('whatsapp') && (
                    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 text-xs h-5 px-1.5">
                      <MessageCircle className="h-2.5 w-2.5" />
                      WhatsApp
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {thread.message_count}
                  </Badge>
                  {thread.failed_count > 0 && (
                    <Badge variant="destructive" className="text-xs h-5 px-1.5">
                      {thread.failed_count} failed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
