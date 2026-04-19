'use client';

import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, MessageCircle, Search, User } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { useChatGrouping } from '@/hooks/use-chat-grouping';
import { ChatHistorySection } from './ChatHistorySection';
import { SearchSection, type ChatSearchResult } from './SearchSection';
import { DocumentSidebar } from './document-sidebar';
import { PlusSquare, LogOut } from 'lucide-react';
import type { ChatSession } from './types';

type TranslateFn = (key: string) => string;

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
  const groupedChats = useChatGrouping(filteredHistory);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearchSubmit?.();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between mb-2">
          <SidebarTrigger />
          <IconButton icon={PlusSquare} tooltip={t('newChatTooltip')} onClick={onNewChat} />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchHistoryPlaceholder')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <SearchSection
          searchResults={searchResults}
          searchLoading={searchLoading}
          onSearchResultSelect={onSearchResultSelect}
          t={t}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* Tab Bar */}
        <div className="flex border-b px-2">
          <button
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={14} />
            Chat
          </button>
          <button
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'docs'
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
            <ChatHistorySection
              groups={groupedChats}
              activeChatId={activeChatId}
              onSelectChat={onSelectChat}
              onDeleteChat={onDeleteChat}
              loading={loading}
              t={t}
            />
          </SidebarMenu>
        )}

        {/* Document Tab */}
        {activeTab === 'docs' && (
          <DocumentSidebar
            userId={userId || ''}
            onAskAboutDocument={onAskAboutDocument || (() => {})}
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
          <IconButton icon={LogOut} tooltip={t('signOutButton')} onClick={onSignOut} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
