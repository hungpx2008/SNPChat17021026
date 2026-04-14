'use client';

import { useState } from "react";
import { Pencil, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageActionsProps {
  role: "user" | "bot";
  messageId: string;
  originalContent: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (newContent: string) => void;
  onRegenerate: () => void;
  loading?: boolean;
}

export function MessageActions({
  role,
  messageId,
  originalContent,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onRegenerate,
  loading,
}: MessageActionsProps) {
  const [editContent, setEditContent] = useState(originalContent);

  if (isEditing) {
    return (
      <div className="mt-2 space-y-2 w-full">
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-[80px] text-sm"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onSubmitEdit(editContent)}
            disabled={loading || !editContent.trim()}
          >
            Gui
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditContent(originalContent);
              onCancelEdit();
            }}
            disabled={loading}
          >
            Huy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {role === "user" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onStartEdit}
          disabled={loading}
          aria-label="Chinh sua tin nhan"
        >
          <Pencil size={14} />
        </Button>
      )}
      {role === "bot" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onRegenerate}
          disabled={loading}
          aria-label="Tao lai phan hoi"
        >
          <RefreshCw size={14} />
        </Button>
      )}
    </div>
  );
}
