'use client';

import type { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Image as ImageIcon, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Typewriter } from "@/components/typewriter";
import { LLMResponseRenderer, containsTableMarkup } from "./llm-response-renderer";
import { FeedbackButtons } from "./feedback-buttons";
import { TTSButton } from "./tts-button";
import type { Message } from "./types";
import type { Attachment } from "@/services/chat-backend";

/**
 * Sanitize bot responses:
 * 1. Strip SQL/Python code blocks that LLM might accidentally include
 * 2. Remove Python tracebacks (Traceback, File "...", Error: ...)
 * 3. Deduplicate citations by filename+page
 */
function sanitizeBotContent(content: string): string {
  let text = content;

  // Strip SQL code blocks: ```sql ... ```
  text = text.replace(/```(?:sql|python|bash|sh|javascript|json)\s*\n[\s\S]*?```/gi, '');

  // Strip Python tracebacks: "Traceback (most recent call last):..." through the error line
  text = text.replace(/Traceback \(most recent call last\):[\s\S]*?(?:\w+Error:.+)/g, '');

  // Strip raw error lines like "sqlalchemy.exc.OperationalError: ..."
  text = text.replace(/^[\w.]+(?:Error|Exception):.+$/gm, '');

  // Deduplicate citations: **[Nguồn: file.pdf, Trang X]** (điểm: Y.YY)
  const citationRegex = /\*\*\[Nguồn:.+?\]\*\*(?:\s*\(điểm:.+?\))?/g;
  const seen = new Set<string>();
  text = text.replace(citationRegex, (match) => {
    // Normalize key: extract just filename + page
    const key = match.replace(/\(điểm:.+?\)/, '').trim();
    if (seen.has(key)) return '';
    seen.add(key);
    return match;
  });

  // Clean up excess blank lines left after stripping
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

interface ChatMessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

function AttachmentRenderer({ attachments }: { attachments: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {attachments.map((att, i) => {
        if (att.type === 'chart') {
          return (
            <div key={i} className="rounded-lg overflow-hidden border border-border/50 bg-background/50">
              <img
                src={att.url}
                alt={att.filename || 'Chart'}
                className="max-w-full max-h-[400px] object-contain mx-auto"
                loading="lazy"
              />
              <div className="px-3 py-1.5 border-t text-[10px] text-muted-foreground flex items-center gap-1">
                <ImageIcon size={10} />
                {att.filename || 'Biểu đồ'}
              </div>
            </div>
          );
        }

        if (att.type === 'audio') {
          return (
            <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-3">
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <Volume2 size={14} className="text-primary" />
                <span>{att.filename || 'Giọng đọc'}</span>
              </div>
              <audio controls className="w-full h-8" preload="none">
                <source src={att.url} type="audio/mpeg" />
                Trình duyệt không hỗ trợ audio.
              </audio>
            </div>
          );
        }

        if (att.type === 'document') {
          return (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors text-xs"
            >
              📄 {att.filename || 'Tải file'}
            </a>
          );
        }

        return null;
      })}
    </div>
  );
}

export function ChatMessageList({ messages, messagesEndRef }: ChatMessageListProps) {
  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {messages.map((message, index) => {
            // Extract attachments and messageId from metadata if available
            const metadata = (message as any).metadata || {};
            const attachments: Attachment[] = metadata.attachments || [];
            const messageId: string | undefined = (message as any).backendId;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 group",
                  message.role === "user" && "justify-end",
                )}
              >
                {message.role === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col max-w-[85%]">
                  <div
                    className={cn(
                      "p-3 rounded-2xl shadow-sm prose prose-sm max-w-none",
                      "prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border rounded-bl-none",
                    )}
                  >
                    {typeof message.content === "string" ? (
                      message.role === "bot" ? (() => {
                        const clean = sanitizeBotContent(message.content);
                        return index === messages.length - 1 && !containsTableMarkup(clean) ? (
                          <Typewriter text={clean} speed={20} />
                        ) : (
                          <LLMResponseRenderer content={clean} />
                        );
                      })() : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      )
                    ) : (
                      message.content
                    )}

                    {/* Render media attachments */}
                    <AttachmentRenderer attachments={attachments} />
                  </div>

                  {/* Feedback + TTS buttons for bot messages */}
                  {message.role === "bot" && typeof message.content === "string" && (
                    <div className="flex items-center gap-1 mt-1">
                      {messageId && <FeedbackButtons messageId={messageId} />}
                      <TTSButton text={message.content} />
                    </div>
                  )}
                </div>
                {message.role === "user" && (
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
  );
}
