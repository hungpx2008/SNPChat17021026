import Image from "next/image";
import { File as FileIcon } from "lucide-react";
import type { AttachedFile } from "./types";

interface AttachmentPreviewProps {
  file: AttachedFile;
  size: "sm" | "lg";
}

export function AttachmentPreview({ file, size }: AttachmentPreviewProps) {
  if (file.type.startsWith("image/")) {
    const dimension = size === "sm" ? 80 : 200;
    return (
      <Image
        src={file.dataUri}
        alt="Attached file"
        width={dimension}
        height={dimension}
        className="rounded-lg mb-2"
      />
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted mb-2 max-w-xs">
      <FileIcon className="h-6 w-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground truncate">{file.name}</span>
    </div>
  );
}
