import { useCallback, useEffect, useRef, useState } from "react";
import { chatBackend, type BackendMessage } from "@/services/chat-backend";
import { AttachmentPreview } from "@/components/chat/attachment-preview";
import type { AttachedFile, Message } from "@/components/chat/types";
import React from "react";

type TranslateFn = (key: string) => string;

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
        attachments?: any[];
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
        };
      }

      return {
        id: new Date(message.created_at).getTime(),
        role: message.role === "assistant" ? "bot" : "user",
        backendId: message.id,
        metadata: { attachments: meta.attachments || [] },
        content: message.content,
      };
    },
    [],
  );

  const loadSessionMessages = useCallback(
    async (sessionId: string) => {
      setMessagesLoading(true);
      try {
        const session = await chatBackend.fetchSession(sessionId);
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

  return {
    messages,
    setMessages,
    messagesLoading,
    messagesEndRef,
    loadSessionMessages,
    welcomeMessage,
    mapBackendMessage,
    scrollToBottom,
    resetMessages,
  };
}
