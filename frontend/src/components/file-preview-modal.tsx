'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AutoTable } from "@/components/ui/auto-table";
import { Loader2, Search, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Input } from "@/components/ui/input";

export type SupportedPreviewType = "pdf" | "docx" | "xlsx" | "pptx" | string;

interface FilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string | null;
  fileName?: string | null;
  showDownload?: boolean;
}

type SearchableWindow = Window & typeof globalThis & {
  find?: (
    query: string,
    caseSensitive?: boolean,
    backwards?: boolean,
    wrapAround?: boolean,
    wholeWord?: boolean,
    searchInFrames?: boolean,
    showDialog?: boolean
  ) => boolean;
};

export function FilePreviewModal({ open, onOpenChange, fileUrl, fileName, showDownload = false }: FilePreviewModalProps) {
  const [xlsxHtml, setXlsxHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pptxStatus, setPptxStatus] = useState<"checking" | "ready" | "processing">("checking");

  // Reset expanded state in subsequent open
  useEffect(() => {
    if (!open) {
      setIsExpanded(false);
      setPptxStatus("checking");
    }
  }, [open]);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const [docxSearchQuery, setDocxSearchQuery] = useState("");

  const fileType: SupportedPreviewType = useMemo(() => {
    if (!fileUrl && !fileName) return "unknown";
    // Ưu tiên fileName vì API download URL không chứa phần mở rộng file
    const nameToDetect = (fileName || fileUrl || "").toLowerCase();

    // Đảm bảo lấy chính xác phần mở rộng
    let ext = nameToDetect;
    if (ext.includes("?")) ext = ext.split("?")[0];
    if (ext.includes(".")) ext = ext.substring(ext.lastIndexOf("."));

    if (ext === ".pdf") return "pdf";
    if (ext === ".docx") return "docx";
    if (ext === ".xlsx" || ext === ".xls") return "xlsx";
    if (ext === ".pptx") return "pptx";
    return "unknown";
  }, [fileUrl, fileName]);

  // Check PPTX conversion status before rendering iframe
  useEffect(() => {
    if (open && fileUrl && fileType === "pptx") {
      setPptxStatus("checking");
      // Check if backend returns PDF for this URL
      fetch(fileUrl, { method: "HEAD" })
        .then(res => {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/pdf")) {
            setPptxStatus("ready");
          } else {
            setPptxStatus("processing");
          }
        })
        .catch(() => setPptxStatus("processing"));
    }
  }, [open, fileUrl, fileType]);

  // XLSX preview: parse first sheet to HTML table string
  useEffect(() => {
    if (!open || fileType !== "xlsx" || !fileUrl) return;
    const loadXlsx = async () => {
      setLoading(true);
      try {
        const resp = await fetch(fileUrl);
        const buffer = await resp.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const sheetName = wb.SheetNames[0];
        const html = XLSX.utils.sheet_to_html(wb.Sheets[sheetName]);
        setXlsxHtml(html);
      } catch (e) {
        console.error("Failed to render xlsx preview", e);
        setXlsxHtml("<p>Không thể xem trước file Excel.</p>");
      } finally {
        setLoading(false);
      }
    };
    void loadXlsx();
  }, [open, fileType, fileUrl]);

  // DOCX preview: render directly to ref using docx-preview
  useEffect(() => {
    let isMounted = true;
    if (!open || fileType !== "docx" || !fileUrl) return;

    // Set a slight delay to ensure the ref container has been rendered to DOM
    setTimeout(async () => {
      if (!isMounted || !docxContainerRef.current) return;
      setLoading(true);
      try {
        const { renderAsync } = await import("docx-preview");
        const resp = await fetch(fileUrl);
        const blob = await resp.blob();
        if (docxContainerRef.current) {
          await renderAsync(blob, docxContainerRef.current, docxContainerRef.current, {
            experimental: true,
            inWrapper: false,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: true,
            useBase64URL: false
          });
        }
      } catch (e) {
        console.error("Failed to render docx", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 100);

    return () => { isMounted = false; };
  }, [open, fileType, fileUrl]);

  const findInDocument = (query: string) => {
    if (typeof window === "undefined" || !query) {
      return;
    }

    const searchableWindow = window as SearchableWindow;
    searchableWindow.find?.(query, false, false, true);
  };

  const renderBody = () => {
    if (!fileUrl) {
      return <p className="text-sm text-muted-foreground p-4">Không có file để xem trước.</p>;
    }

    if (fileType === "pdf" || fileType === "pptx") {
      if (fileType === "pptx" && pptxStatus === "checking") {
        return (
          <div className="flex flex-col items-center justify-center p-8 h-full bg-white text-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Đang lấy trạng thái file...</p>
          </div>
        );
      }

      if (fileType === "pptx" && pptxStatus === "processing") {
        return (
          <div className="flex flex-col items-center justify-center p-8 h-full bg-white text-center gap-3">
            <div className="p-4 bg-muted rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-base font-semibold">Tài liệu đang được xử lý</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Hệ thống đang chuyển đổi bản trình bày sang giao diện xem trước PDF.
              Việc này có thể mất vài phút tùy vào dung lượng file. Vui lòng quay lại sau.
            </p>
          </div>
        );
      }

      // pptx: mong đợi backend cung cấp pdf đã convert
      const url = fileType === "pptx" ? fileUrl.replace(/\.pptx$/i, ".pdf") : fileUrl;
      return (
        <iframe
          src={url}
          className="w-full h-full border-0 rounded-md bg-white"
          title={fileName || "File preview"}
        />
      );
    }

    if (fileType === "docx") {
      return (
        <div className="w-full h-full flex flex-col bg-gray-50 relative">
          <div className="p-2 border-b bg-white flex justify-end shadow-sm">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm trong tài liệu... (Nhấn Enter để tìm tiếp)"
                value={docxSearchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setDocxSearchQuery(val);
                  findInDocument(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    findInDocument(docxSearchQuery);
                  }
                }}
                className="pl-8 h-8 text-xs bg-muted/30 focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="w-full h-full overflow-y-auto bg-gray-50 flex justify-center p-4">
            {/* Container cho docx-preview, render ra giao diện như Google Docs */}
            <div
              ref={docxContainerRef}
              className="w-full max-w-4xl bg-white shadow-sm min-h-screen"
            />
          </div>
        </div>
      );
    }

    if (fileType === "xlsx") {
      return (
        <div className="w-full h-full p-4 bg-white flex flex-col min-h-0">
          {xlsxHtml ? <AutoTable htmlString={xlsxHtml} /> : null}
        </div>
      );
    }

    // fallback using react-doc-viewer
    return (
      <div className="h-full w-full bg-white">
        <DocViewer
          documents={[{ uri: fileUrl, fileType: fileType, fileName: fileName || undefined }]}
          config={{ header: { disableHeader: true } }}
          pluginRenderers={DocViewerRenderers}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 flex flex-col gap-0 border-0 shadow-xl overflow-hidden rounded-xl transition-all duration-300",
          isExpanded
            ? "max-w-[100vw] w-screen h-screen rounded-none"
            : "max-w-5xl w-[95vw] h-[90vh]"
        )}
      >
        <DialogHeader className="px-5 py-3 border-b bg-muted/20 flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <DialogTitle className="text-base font-semibold truncate">
              {fileName || "Xem trước file"}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Xem trước file đính kèm</DialogDescription>
          <div className="flex items-center gap-2">
            {showDownload && fileUrl && (
              <a
                href={fileUrl}
                download={fileName || undefined}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                Tải về
              </a>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted/80 h-8 w-8 text-muted-foreground shrink-0"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="sr-only">Phóng to</span>
            </button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted/10 relative">
          {loading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <span className="text-sm font-medium text-muted-foreground">Đang tải bản xem trước...</span>
            </div>
          )}
          {renderBody()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
