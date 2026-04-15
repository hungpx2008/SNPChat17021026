'use client';

import { Button } from '@/components/ui/button';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
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
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import type { ChatGroup } from '@/hooks/use-chat-grouping';

type TranslateFn = (key: string) => string;

export interface ChatHistorySectionProps {
  groups: ChatGroup[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  loading?: boolean;
  t: TranslateFn;
}

export function ChatHistorySection({
  groups,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  loading,
  t,
}: ChatHistorySectionProps) {
  if (loading) {
    return (
      <SidebarMenuItem>
        <div className="px-2 py-4 text-sm text-muted-foreground">
          {t('thinkingMessage')}
        </div>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      {groups.map(({ label, chats }) => (
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
                    <AlertDialogTitle>{t('deleteChatTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deleteChatDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteChat(chat.id)}>
                      {t('continueButton')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          ))}
        </div>
      ))}
    </>
  );
}
