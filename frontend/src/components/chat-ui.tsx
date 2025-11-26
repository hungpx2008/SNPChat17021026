"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { getHelp } from "../app/actions";
import { useAuth } from "./auth-provider";
import { useLanguage } from "./language-provider";
import { SidebarInset, useSidebar } from "./ui/sidebar";
import { AttachmentPreview } from "./chat/attachment-preview";
import { ChatComposer } from "./chat/chat-composer";
import { ChatHeader } from "./chat/chat-header";
import { ChatMessageList } from "./chat/chat-message-list";
import { ChatSidebar } from "./chat/chat-sidebar";
import type { AttachedFile, ChatSession, Message } from "./chat/types";
import { chatBackend, type BackendMessage, type SearchResult } from "../services/chat-backend";

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
  }, [user?.uid, user?.email]);

  const welcomeMessage = useCallback(
    (): Message => ({
      id: Date.now(),
      role: "bot",
      content: t("welcomeMessage").replace("{department}", department),
    }),
    [department, t],
  );

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [useInternalData, setUseInternalData] = useState(true);
  const [usePersonalData, setUsePersonalData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const mapBackendMessage = useCallback(
    (message: BackendMessage): Message => {
      const meta = (message.metadata ?? {}) as { attachment?: AttachedFile | null };
      if (meta?.attachment) {
        return {
          id: new Date(message.created_at).getTime(),
          role: message.role === "assistant" ? "bot" : "user",
          content: (
            <div>
              <AttachmentPreview file={meta.attachment} size="lg" />
              <p>{message.content}</p>
            </div>
          ),
        };
      }

      return {
        id: new Date(message.created_at).getTime(),
        role: message.role === "assistant" ? "bot" : "user",
        content: message.content,
      };
    },
    [],
  );

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
        })),
      );
      if (sessions.length === 0) {
        setActiveChatId(null);
        setMessages([welcomeMessage()]);
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
      setError("Failed to load sessions. Please try again.");
    } finally {
      setSessionsLoading(false);
    }
  }, [userIdentifier, welcomeMessage, department, t]);

  const loadSessionMessages = useCallback(
    async (sessionId: string) => {
      setMessagesLoading(true);
      try {
        const session = await chatBackend.fetchSession(sessionId);
        const mapped = session.messages.map(mapBackendMessage);
        const finalMessages = mapped.length > 0 ? mapped : [welcomeMessage()];
        setMessages(finalMessages);
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === sessionId ? { ...chat, messages: finalMessages } : chat,
          ),
        );
      } catch (err) {
        console.error("Failed to load session messages", err);
        setError("Unable to load chat history. Please try again.");
      } finally {
        setMessagesLoading(false);
      }
    },
    [mapBackendMessage, welcomeMessage],
  );

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleFormSubmit = useCallback(
    async (formData: FormData): Promise<boolean> => {
      if (submitting) {
        return false;
      }
      const userInput = (formData.get("userInput") as string) ?? "";
      const trimmedInput = userInput.trim();
      if (!trimmedInput && !attachedFile) {
        return false;
      }
      setSubmitting(true);
      setError(null);

      let sessionId = activeChatId;
      const sessionTitle =
        trimmedInput.substring(0, 30) + (trimmedInput.length > 30 ? "..." : "");

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
        content: (
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin h-5 w-5" />
            <span>{t("thinkingMessage")}</span>
          </div>
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

      formRef.current?.reset();
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      const fileToSend = attachedFile;
      setAttachedFile(null);

      try {
        await chatBackend.appendMessage(sessionId, {
          role: "user",
          content: userInput,
          metadata: fileToSend ? { attachment: fileToSend } : undefined,
        });

        const conversation = await chatBackend.fetchSession(sessionId);
        const rawHistory = conversation.messages.slice(0, -1); // exclude current user message

        const normalizedHistory: { role: "user" | "assistant"; content: string }[] = [];
        for (const msg of rawHistory) {
          const role = msg.role === "assistant" ? "assistant" : "user";
          if (normalizedHistory.length === 0 && role === "assistant") {
            normalizedHistory.push({ role: "user", content: "" });
          }

          const last = normalizedHistory.at(-1);
          if (last && last.role === role) {
            last.content = last.content
              ? `${last.content}\n${msg.content}`
              : msg.content;
          } else {
            normalizedHistory.push({ role, content: msg.content });
          }
        }

        if (normalizedHistory.length && normalizedHistory[0]?.role !== "user") {
          normalizedHistory.unshift({ role: "user", content: "" });
        }

        console.log("[ChatUI] normalizedHistory", normalizedHistory);

        const llmResult = await getHelp(
          userInput,
          department,
          fileToSend?.dataUri,
          normalizedHistory,
        );
        const botResponse = llmResult.response;

        await chatBackend.appendMessage(sessionId, {
          role: "assistant",
          content: botResponse,
          metadata: llmResult.usage ? { usage: llmResult.usage } : undefined,
        });

        await loadSessionMessages(sessionId);
        return true;
      } catch (err) {
        console.error("Failed to send message", err);
        setError("Sending message failed. Please try again.");
        await loadSessionMessages(sessionId);
        return true;
      } finally {
        setSubmitting(false);
      }
    },
    [
      activeChatId,
      attachedFile,
      department,
      loadSessionMessages,
      t,
      userIdentifier,
      submitting,
    ],
  );

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        dataUri: reader.result as string,
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([welcomeMessage()]);
    setSearchResults([]);
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    setSearchResults([]);
    const existing = chatHistory.find((chat) => chat.id === chatId);
    if (existing && existing.messages.length > 0) {
      setMessages(existing.messages);
      return;
    }
    await loadSessionMessages(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([welcomeMessage()]);
    }
  };

  const handleSearchSubmit = useCallback(async () => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await chatBackend.semanticSearch({
        user_id: userIdentifier ?? undefined,
        department,
        query,
      });
      setSearchResults(results);
    } catch (err) {
      console.error("Search error", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm, userIdentifier, department]);

  const handleSearchResultSelect = async (result: SearchResult) => {
    const sessionId = result.metadata?.session_id as string | undefined;
    if (sessionId) {
      await handleSelectChat(sessionId);
    }
  };

  return (
    <>
      <ChatSidebar
        chats={chatHistory}
        activeChatId={activeChatId}
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          if (!value) {
            setSearchResults([]);
          }
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
        <ChatMessageList messages={messages} messagesEndRef={messagesEndRef} />
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
        />
      </SidebarInset>
    </>
  );
}
