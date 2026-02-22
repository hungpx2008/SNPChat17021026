import { useRef, useState, type ChangeEvent } from "react";
import { chatBackend } from "@/services/chat-backend";
import type { AttachedFile, Message } from "@/components/chat/types";

export function useFileAttachment(
  userIdentifier: string,
  setMessages: (updater: (prev: Message[]) => Message[]) => void,
  setError: (error: string | null) => void,
) {
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [forceDeepScan, setForceDeepScan] = useState(false);
  const [docRefreshToken, setDocRefreshToken] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a document to upload to Knowledge Engine
    const docExtensions = [".pdf", ".doc", ".docx", ".xlsx", ".pptx", ".txt"];
    const isDocument = docExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (isDocument && file.size > 0) {
      try {
        setError(null);
        const result = await chatBackend.uploadDocument(
          file,
          userIdentifier,
          forceDeepScan,
        );
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
                forceDeepScan,
                true,
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

    // For images — keep the old dataUri behavior
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
    forceDeepScan,
    setForceDeepScan,
    docRefreshToken,
    handleFileAttachClick,
    handleFileChange,
  };
}
