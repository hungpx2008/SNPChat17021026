import { useCallback, useEffect, useRef, useState } from "react";
import { chatBackend, type BackendMessage } from "@/services/chat-backend";
import { AttachmentPreview } from "@/components/chat/attachment-preview";
import type { AttachedFile, Message } from "@/components/chat/types";
import { type TranslationKey } from "@/lib/translations";
import React from "react";

type TranslateFn = (key: TranslationKey) => string;

export function useChatMessages(t: TranslateFn, department: string) {
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
    async (sessionId: string, limit = 100) => {
      setMessagesLoading(true);
      try {
        const session = await chatBackend.fetchSession(sessionId, { limit });
        const mapped = session.messages.map(mapBackendMessage);
        const finalMessages = mapped.length > 0 ? mapped : [welcomeMessage()];
        setMessages(finalMessages);
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
  }, [welcomeMessage]);

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
    welcomeMessage,
    mapBackendMessage,
    scrollToBottom,
    resetMessages,
  };
}
