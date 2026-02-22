"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { getHelp } from "../app/actions";
import { useAuth } from "./auth-provider";
import { useLanguage } from "./language-provider";
import { SidebarInset, useSidebar } from "./ui/sidebar";
import { AttachmentPreview } from "./chat/attachment-preview";
import { ChatComposer, type AgentMode } from "./chat/chat-composer";
import { ChatHeader } from "./chat/chat-header";
import { ChatMessageList } from "./chat/chat-message-list";
import { ChatSidebar } from "./chat/chat-sidebar";
import { ProcessingStatus } from "./chat/processing-status";
import { ErrorBoundary } from "./error-boundary";
import type { Message } from "./chat/types";
import { chatBackend } from "../services/chat-backend";

import { useChatSessions } from "@/hooks/use-chat-sessions";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useFileAttachment } from "@/hooks/use-file-attachment";
import { useChatSearch } from "@/hooks/use-chat-search";
import { useSessionStream } from "@/hooks/use-session-stream";

export function ChatUI({ department }: { department: string }) {
  const { t, language, setLanguage } = useLanguage();
  const { open: sidebarOpen } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();

  const userIdentifier = useMemo(() => {
    if (user?.id) return user.id;
    if (user?.email) return user.email;
    if (typeof window !== "undefined") {
      const cached = window.localStorage.getItem("chatsnp-guest-id");
      if (cached) return cached;
      const generated = `guest-${window.crypto?.randomUUID?.() ?? Date.now()}`;
      window.localStorage.setItem("chatsnp-guest-id", generated);
      return generated;
    }
    return "guest-user";
  }, [user?.id, user?.email]);

  // ─── Local UI state ────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentMode, setAgentMode] = useState<AgentMode>("chat");
  const [useInternalData, setUseInternalData] = useState(true);
  const [usePersonalData, setUsePersonalData] = useState(true);
  const [waitingForTask, setWaitingForTask] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── Custom hooks ──────────────────────────────────────────────
  const {
    messages,
    setMessages,
    messagesLoading,
    messagesEndRef,
    loadSessionMessages,
    welcomeMessage,
    resetMessages,
  } = useChatMessages(t, department);

  const {
    chatHistory,
    setChatHistory,
    activeChatId,
    setActiveChatId,
    sessionsLoading,
    loadSessions,
    handleNewChat: _handleNewChat,
    handleSelectChat: _handleSelectChat,
    handleDeleteChat: _handleDeleteChat,
  } = useChatSessions(userIdentifier, department, t, welcomeMessage);

  const {
    attachedFile,
    setAttachedFile,
    fileInputRef,
    docRefreshToken,
    handleFileAttachClick,
    handleFileChange,
  } = useFileAttachment(userIdentifier, setMessages, setError);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    searchLoading,
    handleSearchSubmit,
    clearSearch,
  } = useChatSearch(userIdentifier, department, setError);

  // ─── SSE stream for Celery task completion ─────────────────────
  const handleSSEMessageReady = useCallback(async () => {
    if (activeChatId) {
      try {
        const finalMessages = await loadSessionMessages(activeChatId);
        if (finalMessages) {
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === activeChatId
                ? { ...chat, messages: finalMessages }
                : chat,
            ),
          );
        }
      } catch {
        // loadSessionMessages already logs errors
      }
      setWaitingForTask(false);
      setSubmitting(false);
    }
  }, [activeChatId, loadSessionMessages, setChatHistory]);

  useSessionStream(activeChatId, waitingForTask, handleSSEMessageReady);

  // SSE fallback timeout: if no event in 90s, force reload
  useEffect(() => {
    if (!waitingForTask) return;
    const timer = setTimeout(async () => {
      if (activeChatId) {
        try {
          await loadSessionMessages(activeChatId);
        } catch {
          // ignore
        }
      }
      setWaitingForTask(false);
      setSubmitting(false);
    }, 90_000);
    return () => clearTimeout(timer);
  }, [waitingForTask, activeChatId, loadSessionMessages]);

  // ─── Auto-resize textarea ──────────────────────────────────────
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  // ─── Load sessions on mount ────────────────────────────────────
  useEffect(() => {
    loadSessions().then((sessions) => {
      if (sessions && sessions.length === 0) {
        setActiveChatId(null);
        resetMessages();
      }
    }).catch(() => {
      setError("Failed to load sessions. Please try again.");
    });
  }, [loadSessions, setActiveChatId, resetMessages]);

  // ─── Bridging callbacks (hooks → UI) ──────────────────────────
  const handleNewChat = useCallback(() => {
    _handleNewChat(resetMessages, clearSearch);
  }, [_handleNewChat, resetMessages, clearSearch]);

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      await _handleSelectChat(chatId, loadSessionMessages, setMessages, clearSearch);
    },
    [_handleSelectChat, loadSessionMessages, setMessages, clearSearch],
  );

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      _handleDeleteChat(chatId, resetMessages);
    },
    [_handleDeleteChat, resetMessages],
  );

  const handleSearchResultSelect = useCallback(
    async (result: { metadata: Record<string, any> }) => {
      const sessionId = result.metadata?.session_id as string | undefined;
      if (sessionId) {
        await handleSelectChat(sessionId);
      }
    },
    [handleSelectChat],
  );

  const handleSignOut = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  // ─── Form submit ──────────────────────────────────────────────
  const handleFormSubmit = useCallback(
    async (formData: FormData): Promise<boolean> => {
      if (submitting) return false;

      const userInput = (formData.get("userInput") as string) ?? "";
      const trimmedInput = userInput.trim();
      if (!trimmedInput && !attachedFile) return false;

      setSubmitting(true);
      setError(null);

      let sessionId = activeChatId;
      const sessionTitle =
        trimmedInput.substring(0, 30) + (trimmedInput.length > 30 ? "..." : "");

      // Create session if needed
      if (!sessionId) {
        try {
          const createdSession = await chatBackend.createSession({
            user_id: userIdentifier,
            department,
            title: sessionTitle,
          });
          sessionId = createdSession.id;
          setActiveChatId(sessionId);
          setChatHistory((prev) => [
            {
              id: createdSession.id,
              title: createdSession.title ?? sessionTitle ?? t("newChatTooltip"),
              messages: [],
              department: createdSession.department ?? department,
              created_at: createdSession.created_at,
            },
            ...prev,
          ]);
        } catch (err) {
          console.error("Failed to create session", err);
          setError("Unable to create a new chat. Please try again.");
          setSubmitting(false);
          return false;
        }
      }

      if (!sessionId) {
        setSubmitting(false);
        return false;
      }

      // Optimistic UI update
      const userMessage: Message = {
        id: Date.now(),
        role: "user",
        content: (
          <div>
            {attachedFile && <AttachmentPreview file={attachedFile} size="lg" />}
            <p>{userInput}</p>
          </div>
        ),
      };

      const thinkingMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        content:
          agentMode === "chat" ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>{t("thinkingMessage")}</span>
            </div>
          ) : (
            <ProcessingStatus mode={agentMode as "sql" | "rag"} />
          ),
      };

      setMessages((prev) => [...prev, userMessage, thinkingMessage]);
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === sessionId
            ? {
                ...chat,
                title:
                  chat.title && chat.title !== t("newChatTooltip")
                    ? chat.title
                    : sessionTitle ?? chat.title,
                messages: [...chat.messages, userMessage],
              }
            : chat,
        ),
      );

      // Clear form
      formRef.current?.reset();
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      const fileToSend = attachedFile;
      setAttachedFile(null);

      try {
        const appendResult = await chatBackend.appendMessage(sessionId, {
          role: "user",
          content: userInput,
          metadata: fileToSend ? { attachment: fileToSend } : undefined,
          mode: agentMode,
        });

        const taskDispatched = (appendResult as any).task_dispatched === true;

        if (taskDispatched) {
          // SSE will handle the response — just set waiting flag
          setWaitingForTask(true);
          // submitting stays true until SSE callback or 90s timeout
        } else {
          // Chat mode: use getHelp() server action directly
          const llmResult = await getHelp({
            question: userInput,
            department,
            sessionId,
            userId: userIdentifier,
            photoDataUri: fileToSend?.dataUri,
          });
          const botResponse = llmResult.response;

          await chatBackend.appendMessage(sessionId, {
            role: "assistant",
            content: botResponse,
            metadata: llmResult.usage ? { usage: llmResult.usage } : undefined,
          });

          await loadSessionMessages(sessionId);
          setSubmitting(false);
        }
        return true;
      } catch (err) {
        console.error("Failed to send message", err);
        setError("Sending message failed. Please try again.");
        try { await loadSessionMessages(sessionId); } catch { /* ignore */ }
        setSubmitting(false);
        return true;
      }
    },
    [
      activeChatId,
      agentMode,
      attachedFile,
      department,
      loadSessionMessages,
      t,
      userIdentifier,
      submitting,
      setActiveChatId,
      setChatHistory,
      setMessages,
      setAttachedFile,
    ],
  );

  // ─── Render ───────────────────────────────────────────────────
  return (
    <>
      <ChatSidebar
        chats={chatHistory}
        activeChatId={activeChatId}
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          if (!value) setSearchResults([]);
        }}
        onSearchSubmit={handleSearchSubmit}
        searchResults={searchResults}
        searchLoading={searchLoading}
        onSearchResultSelect={handleSearchResultSelect}
        onSelectChat={(chatId) => void handleSelectChat(chatId)}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        onSignOut={handleSignOut}
        userEmail={user?.email ?? ""}
        t={t as any}
        loading={sessionsLoading}
        userId={userIdentifier}
        docRefreshToken={docRefreshToken}
        onAskAboutDocument={(filename) => {
          setInput(`Hãy tóm tắt nội dung file ${filename}`);
          textareaRef.current?.focus();
        }}
      />
      <SidebarInset className="flex flex-col h-screen">
        <ChatHeader
          department={department}
          language={language}
          setLanguage={setLanguage}
          t={t as any}
          useInternalData={useInternalData}
          setUseInternalData={setUseInternalData}
          usePersonalData={usePersonalData}
          setUsePersonalData={setUsePersonalData}
          sidebarOpen={sidebarOpen}
        />
        {error && (
          <div className="mx-4 mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {messagesLoading && (
          <div className="flex flex-col items-center justify-center gap-2 py-4 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span>{t("thinkingMessage")}</span>
          </div>
        )}
        <ErrorBoundary>
          <ChatMessageList messages={messages} messagesEndRef={messagesEndRef} />
        </ErrorBoundary>
        <ChatComposer
          formRef={formRef}
          textareaRef={textareaRef}
          fileInputRef={fileInputRef}
          input={input}
          onInputChange={setInput}
          attachedFile={attachedFile}
          onRemoveAttachment={() => setAttachedFile(null)}
          onFileAttachClick={handleFileAttachClick}
          onFileChange={handleFileChange}
          onSubmit={handleFormSubmit}
          submitting={submitting}
          t={t as any}
          selectedMode={agentMode}
          onModeChange={setAgentMode}
        />
      </SidebarInset>
    </>
  );
}
