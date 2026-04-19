import { useCallback, useEffect, useRef, useState } from "react";
import { chatBackend, type Attachment, type BackendMessage } from "@/services/chat-backend";
import { AttachmentPreview } from "@/components/chat/attachment-preview";
import type { AttachedFile, Message } from "@/components/chat/types";
import { type TranslationKey } from "@/lib/translations";
import React from "react";

type TranslateFn = (key: TranslationKey) => string;

export function useChatMessages(t: TranslateFn, department: string) {
  const PAGE_SIZE = 50;
  const welcomeMessage = useCallback(
    (): Message => ({
      id: Date.now(),
      role: "bot",
      content: t("welcomeMessage").replace("{department}", department),
    }),
    [department, t],
  );

  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [oldestMessageId, setOldestMessageId] = useState<string | null>(null);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const mapBackendMessage = useCallback(
    (message: BackendMessage): Message => {
      const meta = (message.metadata ?? {}) as {
        attachment?: AttachedFile | null;
        attachments?: Attachment[];
      };
      if (meta?.attachment) {
        return {
          id: new Date(message.created_at).getTime(),
          role: message.role === "assistant" ? "bot" : "user",
          backendId: message.id,
          metadata: { attachments: meta.attachments || [] },
          content: React.createElement(
            "div",
            null,
            React.createElement(AttachmentPreview, {
              file: meta.attachment,
              size: "lg",
            }),
            React.createElement("p", null, message.content),
          ),
          parentMessageId: message.parent_message_id ?? undefined,
          branchIndex: message.branch_index ?? 0,
          isActiveBranch: message.is_active_branch ?? true,
        };
      }

      return {
        id: new Date(message.created_at).getTime(),
        role: message.role === "assistant" ? "bot" : "user",
        backendId: message.id,
        metadata: { attachments: meta.attachments || [] },
        content: message.content,
        parentMessageId: message.parent_message_id ?? undefined,
        branchIndex: message.branch_index ?? 0,
        isActiveBranch: message.is_active_branch ?? true,
      };
    },
    [],
  );

  const loadSessionMessages = useCallback(
    async (sessionId: string, limit = PAGE_SIZE) => {
      setMessagesLoading(true);
      try {
        const session = await chatBackend.fetchSession(sessionId, { limit });
        const mapped = session.messages.map(mapBackendMessage);
        const finalMessages = mapped.length > 0 ? mapped : [welcomeMessage()];
        setMessages(finalMessages);
        setHasMoreMessages(session.has_more);
        setOldestMessageId(session.oldest_id);
        return finalMessages;
      } catch (err) {
        console.error("Failed to load session messages", err);
        throw err;
      } finally {
        setMessagesLoading(false);
      }
    },
    [mapBackendMessage, welcomeMessage],
  );

  const resetMessages = useCallback(() => {
    setMessages([welcomeMessage()]);
    setHasMoreMessages(false);
    setOldestMessageId(null);
    setLoadingOlderMessages(false);
  }, [welcomeMessage]);

  const loadOlderMessages = useCallback(
    async (sessionId: string) => {
      if (!oldestMessageId || loadingOlderMessages || !hasMoreMessages) {
        return;
      }

      setLoadingOlderMessages(true);
      try {
        const session = await chatBackend.fetchSession(sessionId, {
          limit: PAGE_SIZE,
          beforeId: oldestMessageId,
        });
        const olderMessages = session.messages.map(mapBackendMessage);
        if (olderMessages.length > 0) {
          setMessages((prev) => [...olderMessages, ...prev]);
        }
        setHasMoreMessages(session.has_more);
        setOldestMessageId(session.oldest_id);
      } catch (err) {
        console.error("Failed to load older messages", err);
        throw err;
      } finally {
        setLoadingOlderMessages(false);
      }
    },
    [hasMoreMessages, loadingOlderMessages, mapBackendMessage, oldestMessageId],
  );

  // ─── Semantic actions (encapsulated API) ────────────────────
  const addMessages = useCallback((...msgs: Message[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  const replaceMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, []);

  const updateMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      setMessages(updater);
    },
    [],
  );

  return {
    messages,
    addMessages,
    replaceMessages,
    updateMessages,
    messagesLoading,
    messagesEndRef,
    loadSessionMessages,
    loadOlderMessages,
    hasMoreMessages,
    loadingOlderMessages,
    welcomeMessage,
    mapBackendMessage,
    scrollToBottom,
    resetMessages,
  };
}
