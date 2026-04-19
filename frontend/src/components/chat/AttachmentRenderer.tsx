'use client';

import { Image as ImageIcon, Volume2 } from 'lucide-react';
import { useChatMessageContext } from './ChatMessageContext';
import type { Attachment } from '@/services/chat-backend';

export interface AttachmentRendererProps {
  attachments: Attachment[];
}

export function AttachmentRenderer({ attachments }: AttachmentRendererProps) {
  const { onPreviewAttachment } = useChatMessageContext();

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
          const handleClick = (e: React.MouseEvent) => {
            if (onPreviewAttachment) {
              e.preventDefault();
              onPreviewAttachment(att);
            }
          };
          return (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
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
