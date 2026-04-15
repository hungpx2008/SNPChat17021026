import { useMemo } from 'react';

/** Date group label for sidebar. */
function formatDateLabel(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return 'Khác';
  const today = new Date();
  const normalize = (d: Date) => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  };
  const d0 = normalize(date);
  const t0 = normalize(today);
  const diffDays = Math.round((t0.getTime() - d0.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export interface ChatGroupItem {
  id: string;
  title: string;
  created_at?: string;
}

export interface ChatGroup {
  label: string;
  chats: ChatGroupItem[];
}

/**
 * Groups chat sessions by date (Hôm nay / Hôm qua / formatted date).
 *
 * Pure computation extracted from ChatSidebar.
 * Sorts by created_at descending, then groups by date label.
 */
export function useChatGrouping(chats: ChatGroupItem[]): ChatGroup[] {
  return useMemo(() => {
    const sorted = [...chats].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
    const groups: Record<string, ChatGroupItem[]> = {};
    sorted.forEach((chat) => {
      const dateObj = chat.created_at ? new Date(chat.created_at) : null;
      const label = formatDateLabel(dateObj);
      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    });
    return Object.entries(groups).map(([label, chats]) => ({ label, chats }));
  }, [chats]);
}
