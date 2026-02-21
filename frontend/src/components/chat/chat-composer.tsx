'use client';

import type { ChangeEvent, RefObject, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentPreview } from "./attachment-preview";
import { Paperclip, X, Send, LoaderCircle, Bot, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttachedFile } from "./types";

export type AgentMode = "chat" | "sql" | "rag";

const MODE_OPTIONS: { value: AgentMode; label: string; icon: typeof Bot; description: string }[] = [
  { value: "chat", label: "Trợ lý", icon: Bot, description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", icon: BarChart3, description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", icon: FileText, description: "Hỏi nội dung PDF/file" },
];

const STARTER_TAGS: Record<AgentMode, string[]> = {
  chat: ["Tổng quan hoạt động hôm nay", "Lịch tàu đến cảng", "Quy trình xuất nhập container"],
  sql: ["Sản lượng hàng hoá tháng này", "So sánh Q1 và Q2", "Top 10 khách hàng"],
  rag: ["Biểu giá dịch vụ cầu bến", "Quy định an toàn lao động", "Nội quy cảng"],
};

type TranslateFn = (key: string) => string;

interface ChatComposerProps {
  formRef: RefObject<HTMLFormElement>;
  textareaRef: RefObject<HTMLTextAreaElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  input: string;
  onInputChange: (value: string) => void;
  attachedFile: AttachedFile | null;
  onRemoveAttachment: () => void;
  onFileAttachClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: FormData) => Promise<boolean> | boolean;
  submitting?: boolean;
  t: TranslateFn;
  selectedMode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
}

export function ChatComposer({
  formRef,
  textareaRef,
  fileInputRef,
  input,
  onInputChange,
  attachedFile,
  onRemoveAttachment,
  onFileAttachClick,
  onFileChange,
  onSubmit,
  submitting = false,
  t,
  selectedMode,
  onModeChange,
}: ChatComposerProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const handled = await onSubmit(formData);
    if (!handled) {
      return;
    }

    formElement.reset();
    onInputChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  return (
    <footer className="p-4 border-t bg-card">
      <div className="mx-auto">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 mb-2">
          {MODE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isActive = selectedMode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.description}
                onClick={() => onModeChange(opt.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Starter Tags — Quick Action Chips */}
        {!input.trim() && !attachedFile && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {STARTER_TAGS[selectedMode].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  onInputChange(tag);
                  // Auto-submit after short delay
                  setTimeout(() => formRef.current?.requestSubmit(), 100);
                }}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-accent/50 text-accent-foreground hover:bg-accent hover:shadow-sm border border-accent/30 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {attachedFile && (
          <div className="relative mb-2 w-fit">
            <div className="p-2 border rounded-lg">
              <AttachmentPreview file={attachedFile} size="sm" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={onRemoveAttachment}
            >
              <X size={16} />
              <span className="sr-only">{t("removeAttachmentSr")}</span>
            </Button>
          </div>
        )}
        <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Button type="button" variant="ghost" size="icon" onClick={onFileAttachClick}>
            <Paperclip />
            <span className="sr-only">{t("attachFileSr")}</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,audio/*"
          />
          <Textarea
            ref={textareaRef}
            name="userInput"
            placeholder={
              selectedMode === "sql"
                ? "Hỏi về số liệu cảng... (VD: Thống kê container tháng 1)"
                : selectedMode === "rag"
                  ? "Hỏi về nội dung tài liệu... (VD: Biểu phí cẩu container)"
                  : t("chatInputPlaceholder")
            }
            className="flex-1 resize-none max-h-48"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            autoComplete="off"
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <SubmitButton ariaLabel={t("sendButtonSr")} pending={submitting} />
        </form>
      </div>
    </footer>
  );
}

function SubmitButton({ ariaLabel, pending }: { ariaLabel: string; pending: boolean }) {
  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending}
      variant="outline"
      className="bg-accent hover:bg-accent/90 border-0"
    >
      {pending ? (
        <LoaderCircle className="animate-spin text-accent-foreground" />
      ) : (
        <Send className="text-accent-foreground" />
      )}
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}

