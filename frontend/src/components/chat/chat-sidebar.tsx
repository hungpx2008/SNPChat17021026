'use client';

import { useState } from 'react';

import type { ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoaderCircle, LogOut, PlusSquare, Search, Trash2, User, FileText, MessageCircle } from "lucide-react";
import type { ChatSession } from "./types";
import { DocumentSidebar } from "./document-sidebar";

type TranslateFn = (key: string) => string;

interface ChatSearchResult {
  text: string;
  score: number;
  source: string;
  metadata: Record<string, any>;
}

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string | null;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearchSubmit?: () => void;
  searchResults?: ChatSearchResult[];
  searchLoading?: boolean;
  onSearchResultSelect?: (result: ChatSearchResult) => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onSignOut: () => void | Promise<void>;
  userEmail?: string | null;
  t: TranslateFn;
  loading?: boolean;
  userId?: string;
  onAskAboutDocument?: (filename: string) => void;
  docRefreshToken?: number;
}

export function ChatSidebar({
  chats,
  activeChatId,
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  searchResults = [],
  searchLoading,
  onSearchResultSelect,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onSignOut,
  userEmail,
  t,
  loading,
  userId,
  onAskAboutDocument,
  docRefreshToken,
}: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');
  const filteredHistory = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDateLabel = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return "Khác";
    const today = new Date();
    const normalize = (d: Date) => {
      const c = new Date(d);
      c.setHours(0, 0, 0, 0);
      return c;
    };
    const d0 = normalize(date);
    const t0 = normalize(today);
    const diffDays = Math.round((t0.getTime() - d0.getTime()) / 86_400_000);
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const groupedChats = (() => {
    const sorted = [...filteredHistory].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
    const groups: Record<string, ChatSession[]> = {};
    sorted.forEach((chat) => {
      const dateObj = chat.created_at ? new Date(chat.created_at) : null;
      const label = formatDateLabel(dateObj);
      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    });
    return Object.entries(groups).map(([label, chats]) => ({ label, chats }));
  })();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearchSubmit?.();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between mb-2">
          <SidebarTrigger />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onNewChat}
                >
                  <PlusSquare />
                  <span className="sr-only">{t("newChatTooltip")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("newChatTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchHistoryPlaceholder")}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        {searchLoading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>{t("thinkingMessage")}</span>
          </div>
        )}
        {!searchLoading && searchResults.length > 0 && (
          <div className="mt-2 space-y-1 rounded-md border bg-card p-2">
            {searchResults.map((result, index) => (
              <button
                key={`${result.metadata?.session_id ?? index}-${index}`}
                type="button"
                className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                onClick={() => onSearchResultSelect?.(result)}
              >
                <p className="line-clamp-2">{result.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Score: {Number.isFinite(result.score) ? result.score.toFixed(2) : "--"}
                </p>
              </button>
            ))}
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* Tab Bar */}
        <div className="flex border-b px-2">
          <button
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors ${activeTab === 'chat'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={14} />
            Chat
          </button>
          <button
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors ${activeTab === 'docs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('docs')}
          >
            <FileText size={14} />
            Tài liệu
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <SidebarMenu>
            {loading && (
              <SidebarMenuItem>
                <div className="px-2 py-4 text-sm text-muted-foreground">
                  {t("thinkingMessage")}
                </div>
              </SidebarMenuItem>
            )}
            {!loading && groupedChats.map(({ label, chats }) => (
              <div key={label} className="mt-2 first:mt-1">
                <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  {label}
                </div>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      tooltip={chat.title}
                      size="sm"
                      className="w-full justify-start"
                      isActive={chat.id === activeChatId}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <span className="truncate flex-1 text-left">{chat.title}</span>
                    </SidebarMenuButton>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("deleteChatTitle")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteChatDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteChat(chat.id)}>
                            {t("continueButton")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </SidebarMenuItem>
                ))}
              </div>
            ))}
          </SidebarMenu>
        )}

        {/* Document Tab */}
        {activeTab === 'docs' && (
          <DocumentSidebar
            userId={userId || ''}
            onAskAboutDocument={onAskAboutDocument || (() => { })}
            visible={activeTab === 'docs'}
            refreshToken={docRefreshToken}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userEmail}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onSignOut}
                >
                  <LogOut />
                  <span className="sr-only">{t("signOutButton")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("signOutButton")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
