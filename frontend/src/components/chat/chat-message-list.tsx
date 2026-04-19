'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FeedbackButtons } from './feedback-buttons';
import { TTSButton } from './tts-button';
import { BranchNavigator } from './branch-navigator';
import { MessageActions } from './message-actions';
import { AttachmentRenderer } from './AttachmentRenderer';
import { BotMessageContent } from './BotMessageContent';
import { ChatMessageProvider, type ChatMessageContextValue } from './ChatMessageContext';
import type { Message } from './types';
import type { Attachment, BranchInfo } from '@/services/chat-backend';

interface ChatMessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
  hasMoreMessages?: boolean;
  loadingOlderMessages?: boolean;
  onLoadOlderMessages?: () => Promise<void>;
  onPreviewAttachment?: (att: Attachment) => void;
  branchInfoMap?: Record<string, BranchInfo>;
  onNavigateBranch?: (messageId: string, direction: 'prev' | 'next') => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  editingMessageId?: string | null;
  onStartEdit?: (messageId: string) => void;
  onCancelEdit?: () => void;
  branchLoading?: boolean;
}

export function ChatMessageList({
  messages,
  messagesEndRef,
  hasMoreMessages = false,
  loadingOlderMessages = false,
  onLoadOlderMessages,
  onPreviewAttachment,
  branchInfoMap = {},
  onNavigateBranch,
  onEditMessage,
  onRegenerateMessage,
  editingMessageId,
  onStartEdit,
  onCancelEdit,
  branchLoading,
}: ChatMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const restoreScrollRef = useRef<{ previousHeight: number; previousTop: number } | null>(null);

  const getViewport = useCallback(() => {
    return scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
  }, []);

  const triggerLoadOlder = useCallback(async () => {
    if (!hasMoreMessages || loadingOlderMessages || !onLoadOlderMessages) {
      return;
    }
    const viewport = getViewport();
    if (viewport) {
      restoreScrollRef.current = {
        previousHeight: viewport.scrollHeight,
        previousTop: viewport.scrollTop,
      };
    }
    await onLoadOlderMessages();
  }, [getViewport, hasMoreMessages, loadingOlderMessages, onLoadOlderMessages]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      if (viewport.scrollTop <= 24) {
        void triggerLoadOlder();
      }
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [getViewport, triggerLoadOlder]);

  useEffect(() => {
    const viewport = getViewport();
    const restore = restoreScrollRef.current;
    if (!viewport || !restore) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight - restore.previousHeight + restore.previousTop;
    restoreScrollRef.current = null;
  }, [getViewport, messages]);

  const ctxValue: ChatMessageContextValue = {
    onPreviewAttachment,
    branchInfoMap,
    onNavigateBranch,
    onEditMessage,
    onRegenerateMessage,
    editingMessageId: editingMessageId ?? null,
    onStartEdit,
    onCancelEdit,
    branchLoading,
  };

  return (
    <ChatMessageProvider value={ctxValue}>
      <main className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-6">
            {loadingOlderMessages && (
              <div className="text-center text-sm text-muted-foreground">
                Đang tải tin nhắn cũ hơn...
              </div>
            )}
            {!hasMoreMessages && messages.length > 0 && (
              <div className="text-center text-xs text-muted-foreground">
                Đây là tin nhắn đầu tiên trong cuộc trò chuyện.
              </div>
            )}
            {messages.map((message, index) => {
              const metadata = (message as any).metadata || {};
              const attachments: Attachment[] = metadata.attachments || [];
              const messageId: string | undefined = (message as any).backendId;
              const branchInfo = messageId ? branchInfoMap[messageId] : undefined;
              const isEditing = editingMessageId === messageId;

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3 group',
                    message.role === 'user' && 'justify-end',
                  )}
                >
                  {message.role === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={cn(
                        'p-3 rounded-2xl shadow-sm prose prose-sm max-w-none',
                        'prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card border rounded-bl-none',
                      )}
                    >
                      {typeof message.content === 'string' ? (
                        message.role === 'bot' ? (
                          <BotMessageContent
                            content={message.content}
                            isLast={index === messages.length - 1}
                          />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        )
                      ) : (
                        message.content
                      )}

                      {/* Render media attachments */}
                      <AttachmentRenderer attachments={attachments} />
                    </div>

                    {/* Branch navigation + message actions row */}
                    <div className="flex items-center gap-1 mt-1">
                      {message.role === 'bot' && typeof message.content === 'string' && (
                        <>
                          {messageId && <FeedbackButtons messageId={messageId} />}
                          <TTSButton text={message.content} />
                        </>
                      )}

                      {branchInfo && onNavigateBranch && messageId && (
                        <BranchNavigator
                          branchInfo={branchInfo}
                          onNavigate={(dir) => onNavigateBranch(messageId, dir)}
                          loading={branchLoading}
                        />
                      )}

                      {messageId && typeof message.content === 'string' && (
                        <MessageActions
                          role={message.role}
                          messageId={messageId}
                          originalContent={message.content}
                          isEditing={!!isEditing}
                          onStartEdit={() => onStartEdit?.(messageId)}
                          onCancelEdit={() => onCancelEdit?.()}
                          onSubmitEdit={(newContent) => onEditMessage?.(messageId, newContent)}
                          onRegenerate={() => onRegenerateMessage?.(messageId)}
                          loading={branchLoading}
                        />
                      )}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>
    </ChatMessageProvider>
  );
}
