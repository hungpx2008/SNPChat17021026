import { useCallback, useState } from "react";
import { chatBackend } from "@/services/chat-backend";
import type { ChatSession, Message } from "@/components/chat/types";

type TranslateFn = (key: string) => string;

export function useChatSessions(
  userIdentifier: string,
  department: string,
  t: TranslateFn,
  welcomeMessage: () => Message,
) {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const sessions = await chatBackend.listSessions(userIdentifier);
      setChatHistory(
        sessions.map((session) => ({
          id: session.id,
          title: session.title ?? t("newChatTooltip"),
          messages: [],
          department: session.department ?? department,
          created_at: session.created_at,
        })),
      );
      return sessions;
    } catch (err) {
      console.error("Failed to load sessions", err);
      throw err;
    } finally {
      setSessionsLoading(false);
    }
  }, [userIdentifier, department, t]);

  const handleNewChat = useCallback(
    (resetMessages: () => void, clearSearch: () => void) => {
      setActiveChatId(null);
      resetMessages();
      clearSearch();
    },
    [],
  );

  const handleSelectChat = useCallback(
    async (
      chatId: string,
      loadSessionMessages: (id: string) => Promise<void>,
      setMessages: (msgs: Message[]) => void,
      clearSearch: () => void,
    ) => {
      setActiveChatId(chatId);
      clearSearch();
      const existing = chatHistory.find((chat) => chat.id === chatId);
      if (existing && existing.messages.length > 0) {
        setMessages(existing.messages);
        return;
      }
      await loadSessionMessages(chatId);
    },
    [chatHistory],
  );

  const handleDeleteChat = useCallback(
    (chatId: string, resetMessages: () => void) => {
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        resetMessages();
      }
    },
    [activeChatId],
  );

  return {
    chatHistory,
    setChatHistory,
    activeChatId,
    setActiveChatId,
    sessionsLoading,
    loadSessions,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
  };
}
