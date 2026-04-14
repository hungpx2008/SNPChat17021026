import { useCallback, useState } from "react";
import { chatBackend, type BackendMessage, type BranchInfo } from "@/services/chat-backend";
import type { Message } from "@/components/chat/types";

type SetMessages = React.Dispatch<React.SetStateAction<Message[]>>;
type MapBackendMessage = (message: BackendMessage) => Message;

export function useConversationTree(
  sessionId: string | null,
  setMessages: SetMessages,
  mapBackendMessage: MapBackendMessage,
) {
  const [branchInfoMap, setBranchInfoMap] = useState<Record<string, BranchInfo>>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [branchLoading, setBranchLoading] = useState(false);

  const fetchBranchInfo = useCallback(
    async (messageId: string) => {
      if (!sessionId) return;
      try {
        const info = await chatBackend.getBranchInfo(sessionId, messageId);
        setBranchInfoMap((prev) => ({ ...prev, [messageId]: info }));
      } catch (err) {
        console.error("Failed to fetch branch info for", messageId, err);
      }
    },
    [sessionId],
  );

  const fetchAllBranchInfo = useCallback(
    async (messages: Message[]) => {
      if (!sessionId) return;
      const messagesWithIds = messages.filter((m) => m.backendId);
      const results: Record<string, BranchInfo> = {};

      await Promise.allSettled(
        messagesWithIds.map(async (m) => {
          try {
            const info = await chatBackend.getBranchInfo(sessionId, m.backendId!);
            if (info.total_branches > 1) {
              results[m.backendId!] = info;
            }
          } catch {
            // skip messages without branch info
          }
        }),
      );

      setBranchInfoMap(results);
    },
    [sessionId],
  );

  const navigateBranch = useCallback(
    async (messageId: string, direction: "prev" | "next") => {
      if (!sessionId) return;
      setBranchLoading(true);
      try {
        const updatedMessages = await chatBackend.navigateBranch(sessionId, messageId, direction);
        const mapped = updatedMessages.map(mapBackendMessage);
        setMessages(mapped);
        // Refresh branch info after navigation
        await fetchAllBranchInfo(mapped);
      } catch (err) {
        console.error("Failed to navigate branch", err);
      } finally {
        setBranchLoading(false);
      }
    },
    [sessionId, mapBackendMessage, setMessages, fetchAllBranchInfo],
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!sessionId) return;
      setBranchLoading(true);
      setEditingMessageId(null);
      try {
        await chatBackend.editMessage(sessionId, messageId, newContent);
        return true;
      } catch (err) {
        console.error("Failed to edit message", err);
        return false;
      } finally {
        setBranchLoading(false);
      }
    },
    [sessionId],
  );

  const regenerateMessage = useCallback(
    async (messageId: string) => {
      if (!sessionId) return;
      setBranchLoading(true);
      try {
        await chatBackend.regenerateMessage(sessionId, messageId);
        return true;
      } catch (err) {
        console.error("Failed to regenerate message", err);
        return false;
      } finally {
        setBranchLoading(false);
      }
    },
    [sessionId],
  );

  const startEditing = useCallback((messageId: string) => {
    setEditingMessageId(messageId);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingMessageId(null);
  }, []);

  return {
    branchInfoMap,
    editingMessageId,
    branchLoading,
    fetchBranchInfo,
    fetchAllBranchInfo,
    navigateBranch,
    editMessage,
    regenerateMessage,
    startEditing,
    cancelEditing,
  };
}
