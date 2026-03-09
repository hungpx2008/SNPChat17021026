import { useRef, useState, type ChangeEvent } from "react";
import { chatBackend } from "@/services/chat-backend";
import type { AttachedFile, Message } from "@/components/chat/types";

export function useFileAttachment(
  userIdentifier: string,
  setMessages: (updater: (prev: Message[]) => Message[]) => void,
  setError: (error: string | null) => void,
) {
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [docRefreshToken, setDocRefreshToken] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Documents and audio → upload to Knowledge Engine (Docling pipeline)
    const docExtensions = [".pdf", ".doc", ".docx", ".xlsx", ".pptx", ".txt", ".mp3", ".wav", ".m4a", ".aac"];
    const isDocument = docExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (isDocument && file.size > 0) {
      try {
        setError(null);
        const result = await chatBackend.uploadDocument(file, userIdentifier);
        const uploadMessage: Message = {
          id: Date.now(),
          role: "bot",
          content: `📄 Đã upload file **${result.filename}** — đang xử lý...\nID: \`${result.document_id}\``,
        };
        setMessages((prev) => [...prev, uploadMessage]);
        setDocRefreshToken((t) => t + 1);
      } catch (err: any) {
        const status = err?.status;
        const detail =
          err?.detail ||
          err?.message ||
          "File đã tồn tại. Bạn có muốn ghi đè không?";
        if (status === 409) {
          try {
            const shouldOverwrite = window.confirm(
              `${detail}\n\nChọn OK để ghi đè, Cancel để giữ nguyên.`,
            );
            if (shouldOverwrite) {
              const result = await chatBackend.uploadDocument(
                file,
                userIdentifier,
                true, // overwrite
              );
              const uploadMessage: Message = {
                id: Date.now(),
                role: "bot",
                content: `📄 Đã ghi đè file **${result.filename}** — đang xử lý lại...\nID: \`${result.document_id}\``,
              };
              setMessages((prev) => [...prev, uploadMessage]);
              setDocRefreshToken((t) => t + 1);
            } else {
              setMessages((prev) => [
                ...prev,
                { id: Date.now(), role: "bot", content: "❌ Đã hủy upload." },
              ]);
            }
          } catch (e: any) {
            setError(`Upload thất bại: ${e?.message || detail}`);
          }
        } else {
          console.error("Upload failed:", err);
          setError(`Upload thất bại: ${detail}`);
        }
      }
      if (event.target) event.target.value = "";
      return;
    }

    // Images → keep dataUri for inline preview
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

  return {
    attachedFile,
    setAttachedFile,
    fileInputRef,
    docRefreshToken,
    handleFileAttachClick,
    handleFileChange,
  };
}
