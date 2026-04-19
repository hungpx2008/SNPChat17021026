'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Attachment, BranchInfo } from '@/services/chat-backend';

export interface ChatMessageContextValue {
  onPreviewAttachment?: (att: Attachment) => void;
  branchInfoMap: Record<string, BranchInfo>;
  onNavigateBranch?: (messageId: string, direction: 'prev' | 'next') => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  editingMessageId: string | null;
  onStartEdit?: (messageId: string) => void;
  onCancelEdit?: () => void;
  branchLoading?: boolean;
}

const ChatMessageCtx = createContext<ChatMessageContextValue | null>(null);

export function useChatMessageContext(): ChatMessageContextValue {
  const ctx = useContext(ChatMessageCtx);
  if (!ctx) {
    throw new Error('useChatMessageContext must be used within ChatMessageProvider');
  }
  return ctx;
}

export function ChatMessageProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ChatMessageContextValue;
}) {
  const memoized = useMemo(() => value, [
    value.branchInfoMap,
    value.editingMessageId,
    value.branchLoading,
    value.onPreviewAttachment,
    value.onNavigateBranch,
    value.onEditMessage,
    value.onRegenerateMessage,
    value.onStartEdit,
    value.onCancelEdit,
  ]);
  return (
    <ChatMessageCtx.Provider value={memoized}>
      {children}
    </ChatMessageCtx.Provider>
  );
}
