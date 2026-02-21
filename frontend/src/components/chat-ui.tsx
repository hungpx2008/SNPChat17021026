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
import { ChatComposer, type AgentMode } from "./chat/chat-composer";
import { ChatHeader } from "./chat/chat-header";
import { ChatMessageList } from "./chat/chat-message-list";
import { ChatSidebar } from "./chat/chat-sidebar";
import { ProcessingStatus } from "./chat/processing-status";
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
  }, [user?.id, user?.email]);

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
  const [forceDeepScan, setForceDeepScan] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>("auto");
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
      const meta = (message.metadata ?? {}) as { attachment?: AttachedFile | null; attachments?: any[] };
      if (meta?.attachment) {
        return {
          id: new Date(message.created_at).getTime(),
          role: message.role === "assistant" ? "bot" : "user",
          backendId: message.id,
          metadata: { attachments: meta.attachments || [] },
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
        backendId: message.id,
        metadata: { attachments: meta.attachments || [] },
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
          agentMode === "chat" ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>{t("thinkingMessage")}</span>
            </div>
          ) : (
            <ProcessingStatus mode={agentMode} />
          )
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
        const appendResult = await chatBackend.appendMessage(sessionId, {
          role: "user",
          content: userInput,
          metadata: fileToSend ? { attachment: fileToSend } : undefined,
          mode: agentMode,
        });

        // Check if backend dispatched a Celery task (SQL/RAG)
        const taskDispatched = (appendResult as any).task_dispatched === true;

        if (taskDispatched) {
          // Poll for Celery result instead of calling getHelp()
          const maxAttempts = 30; // 30 * 2s = 60s max wait
          let found = false;
          for (let i = 0; i < maxAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              const session = await chatBackend.fetchSession(sessionId, { limit: 5 });
              const lastMsg = session.messages?.[session.messages.length - 1];
              if (lastMsg && lastMsg.role === 'assistant') {
                found = true;
                break;
              }
            } catch {
              // ignore polling errors
            }
          }
          await loadSessionMessages(sessionId);
        } else {
          // General query: use getHelp() server action
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
        }
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
      agentMode,
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

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Check if it's a document to upload to Knowledge Engine
    const docExtensions = ['.pdf', '.doc', '.docx', '.xlsx', '.pptx', '.txt'];
    const isDocument = docExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isDocument && file.size > 0) {
      // Upload to backend Knowledge Engine
      try {
        setError(null);
        const result = await chatBackend.uploadDocument(file, userIdentifier, forceDeepScan);
        // Show success in chat
        const uploadMessage: Message = {
          id: Date.now(),
          role: "bot",
          content: `📄 Đã upload file **${result.filename}** — đang xử lý...\nID: \`${result.document_id}\``,
        };
        setMessages(prev => [...prev, uploadMessage]);
      } catch (err: any) {
        // Handle 409 Conflict (duplicate file) — ask user to overwrite
        const errMsg = err?.message || '';
        if (errMsg.includes('409')) {
          try {
            const detail = JSON.parse(errMsg.replace(/^.*?409\s*/, ''));
            const shouldOverwrite = confirm(
              `${detail.message}\n\nNhấn OK để ghi đè, Cancel để hủy.`
            );
            if (shouldOverwrite) {
              const result = await chatBackend.uploadDocument(file, userIdentifier, forceDeepScan, true);
              const uploadMessage: Message = {
                id: Date.now(),
                role: "bot",
                content: `📄 Đã ghi đè file **${result.filename}** — đang xử lý lại...\nID: \`${result.document_id}\``,
              };
              setMessages(prev => [...prev, uploadMessage]);
            } else {
              setMessages(prev => [...prev, {
                id: Date.now(),
                role: "bot",
                content: "❌ Đã hủy upload.",
              }]);
            }
          } catch {
            setError(`Upload thất bại: ${errMsg}`);
          }
        } else {
          console.error('Upload failed:', err);
          setError(`Upload thất bại: ${errMsg}`);
        }
      }
      // Reset file input
      if (event.target) event.target.value = '';
      return;
    }

    // For images — keep the old dataUri behavior
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
        userId={userIdentifier}
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
          selectedMode={agentMode}
          onModeChange={setAgentMode}
        />
      </SidebarInset>
    </>
  );
}
