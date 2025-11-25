'use client';

import type { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Typewriter } from "@/components/typewriter";
import { LLMResponseRenderer, containsTableMarkup } from "./llm-response-renderer";
import type { Message } from "./types";

interface ChatMessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatMessageList({ messages, messagesEndRef }: ChatMessageListProps) {
  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
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
                  message.role === "bot" ? (
                    index === messages.length - 1 && !containsTableMarkup(message.content) ? (
                      <Typewriter text={message.content} speed={20} />
                    ) : (
                      <LLMResponseRenderer content={message.content} />
                    )
                  ) : (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  )
                ) : (
                  message.content
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
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </main>
  );
}
