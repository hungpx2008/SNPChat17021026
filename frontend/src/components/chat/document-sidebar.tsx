'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, RefreshCw, Search, CheckCircle2, XCircle, Loader2, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { chatBackend, type DocumentInfo } from '@/services/chat-backend';
import { FilePreviewModal } from '../file-preview-modal';

interface DocumentSidebarProps {
    userId: string;
    onAskAboutDocument: (filename: string) => void;
    visible: boolean;
    /** Bump để ép reload danh sách tài liệu (khi upload xong). */
    refreshToken?: number;
}

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; animate: boolean }> = {
    processing: { icon: Loader2, label: 'Đang xử lý...', variant: 'secondary', animate: true },
    ready:      { icon: CheckCircle2, label: 'Sẵn sàng', variant: 'default', animate: false },
    error:      { icon: XCircle, label: 'Lỗi', variant: 'destructive', animate: false },
};

export function DocumentSidebar({ userId, onAskAboutDocument, visible, refreshToken }: DocumentSidebarProps) {
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [previewDoc, setPreviewDoc] = useState<DocumentInfo | null>(null);

    // Build preview/download URL from document id
    const previewUrl = useMemo(
        () => previewDoc ? chatBackend.getDocumentDownloadUrl(previewDoc.id) : '',
        [previewDoc],
    );

    const loadDocuments = useCallback(async (signal?: AbortSignal) => {
        if (!userId) return;
        setLoading(true);
        try {
            const docs = await chatBackend.listDocuments(userId, signal);
            if (!signal?.aborted) {
                setDocuments(docs);
            }
        } catch (err) {
            // Ignore AbortError — expected when component unmounts or effect re-runs
            if (err instanceof DOMException && err.name === 'AbortError') return;
            console.error('Failed to load documents', err);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [userId]);

    // Load documents when sidebar becomes visible OR when refreshToken bumps (upload done)
    useEffect(() => {
        if (!visible) return;

        const controller = new AbortController();
        void loadDocuments(controller.signal);
        return () => controller.abort('cleanup');
    }, [visible, refreshToken, loadDocuments]);

    // Auto-refresh processing documents every 5s until done
    useEffect(() => {
        const hasActive = documents.some(d => d.status === 'processing');
        if (!hasActive || !visible) return;

        const controller = new AbortController();
        const interval = setInterval(() => {
            void loadDocuments(controller.signal);
        }, 5000);
        return () => {
            clearInterval(interval);
            controller.abort('cleanup');
        };
    }, [documents, visible, loadDocuments]);

    const filteredDocs = searchTerm
        ? documents.filter(d => d.filename.toLowerCase().includes(searchTerm.toLowerCase()))
        : documents;

    // Group documents by date (Zalo-style date headers)
    const groupedDocs = useMemo(() => {
        const groups: { label: string; key: string; docs: DocumentInfo[] }[] = [];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const toDateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const todayKey = toDateKey(today);
        const yesterdayKey = toDateKey(yesterday);

        for (const doc of filteredDocs) {
            const docDate = new Date(doc.created_at);
            const key = toDateKey(docDate);

            let label: string;
            if (key === todayKey) {
                label = 'Hôm nay';
            } else if (key === yesterdayKey) {
                label = 'Hôm qua';
            } else {
                label = `Ngày ${docDate.getDate()} Tháng ${docDate.getMonth() + 1}, ${docDate.getFullYear()}`;
            }

            const existing = groups.find(g => g.key === key);
            if (existing) {
                existing.docs.push(doc);
            } else {
                groups.push({ label, key, docs: [doc] });
            }
        }
        return groups;
    }, [filteredDocs]);

    if (!visible) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="p-3 border-b">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Kho tài liệu
                </h3>
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm file..."
                        className="w-full pl-7 pr-3 py-1.5 text-xs rounded-md border border-input bg-background"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {loading && documents.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground text-xs">
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Đang tải...
                        </div>
                    ) : groupedDocs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                            {searchTerm ? 'Không tìm thấy file' : 'Chưa có tài liệu nào'}
                        </div>
                    ) : (
                        groupedDocs.map((group, groupIdx) => (
                            <div key={group.key}>
                                {/* ── Date header (Zalo-style) ── */}
                                <div className={cn(
                                    "flex items-center gap-2 px-1 mb-1.5",
                                    groupIdx > 0 && "mt-3",
                                )}>
                                    <div className="h-px flex-1 bg-border" />
                                    <span className="text-[10px] font-semibold text-foreground whitespace-nowrap">
                                        {group.label}
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                {/* ── Documents in this date group ── */}
                                <div className="space-y-1">
                                    {group.docs.map(doc => {
                                        const config = STATUS_CONFIG[doc.status] || STATUS_CONFIG.processing;
                                        const Icon = config.icon;
                                        return (
                                            <div
                                                key={doc.id}
                                                className="group p-2 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <FileText size={16} className="mt-0.5 text-primary shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={cn(
                                                                "text-xs font-medium truncate",
                                                                doc.status === 'ready' && "cursor-pointer hover:text-primary hover:underline",
                                                            )}
                                                            title={doc.filename}
                                                            onClick={() => doc.status === 'ready' && setPreviewDoc(doc)}
                                                        >
                                                            {doc.filename}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Badge variant={config.variant} className="text-[10px] py-0 px-1.5 h-4">
                                                                <Icon size={10} className={cn("mr-0.5", config.animate && "animate-spin")} />
                                                                {config.label}
                                                            </Badge>
                                                            {doc.chunk_count > 0 && (
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {doc.chunk_count} chunks
                                                                </span>
                                                            )}
                                                            {doc.extractor_used && doc.status === 'ready' && (
                                                                <Badge variant="outline" className="text-[10px] py-0 px-1 h-4">
                                                                    🔬 {doc.extractor_used}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ====== PROCESSING — progress bar + cancel ====== */}
                                                {doc.status === 'processing' && (
                                                    <>
                                                        <div className="mt-2 p-2 rounded-md bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                                            <p className="text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                                                <Loader2 size={12} className="animate-spin shrink-0" />
                                                                Đang phân tích tài liệu qua Docling... đợi chút nhé
                                                            </p>
                                                            <div className="mt-1.5 w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 overflow-hidden">
                                                                <div className="h-full w-3/5 bg-purple-500 rounded-full animate-pulse" />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full mt-1 h-6 text-[10px] text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={async () => {
                                                                if (!confirm(`Hủy xử lý "${doc.filename}"?`)) return;
                                                                try {
                                                                    await chatBackend.cancelDocument(doc.id);
                                                                    setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                                                } catch (err) {
                                                                    console.error('Cancel failed', err);
                                                                    alert('Hủy xử lý thất bại');
                                                                }
                                                            }}
                                                        >
                                                            🗑️ Hủy & Xóa
                                                        </Button>
                                                    </>
                                                )}

                                                {/* ====== READY — Preview / Ask bot / Delete ====== */}
                                                {doc.status === 'ready' && (
                                                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-[10px]"
                                                            onClick={() => setPreviewDoc(doc)}
                                                        >
                                                            <Eye size={10} className="mr-0.5" />
                                                            Xem
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex-1 h-6 text-[10px]"
                                                            onClick={() => onAskAboutDocument(doc.filename)}
                                                        >
                                                            💬 Hỏi Bot
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={async () => {
                                                                if (!confirm(`Xóa tài liệu "${doc.filename}" và toàn bộ dữ liệu đã embedding?`)) return;
                                                                try {
                                                                    await chatBackend.cancelDocument(doc.id);
                                                                    setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                                                } catch (err) {
                                                                    console.error('Delete failed', err);
                                                                    alert('Xóa tài liệu thất bại');
                                                                }
                                                            }}
                                                        >
                                                            🗑️ Xóa
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* ====== ERROR — Error message + Delete ====== */}
                                                {doc.status === 'error' && (
                                                    <div className="mt-1">
                                                        {doc.error_message && (
                                                            <p className="text-[10px] text-destructive truncate mb-1" title={doc.error_message}>
                                                                {doc.error_message}
                                                            </p>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full h-6 text-[10px] text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={async () => {
                                                                try {
                                                                    await chatBackend.cancelDocument(doc.id);
                                                                    setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                                                } catch (err) {
                                                                    console.error('Delete failed', err);
                                                                }
                                                            }}
                                                        >
                                                            🗑️ Xóa
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-2 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => void loadDocuments()}
                    disabled={loading}
                >
                    <RefreshCw size={12} className={cn("mr-1", loading && "animate-spin")} />
                    Làm mới
                </Button>
            </div>

            {/* ====== DOCUMENT PREVIEW MODAL ====== */}
            <FilePreviewModal
                open={!!previewDoc}
                onOpenChange={(open) => { if (!open) setPreviewDoc(null); }}
                fileUrl={previewUrl || null}
                fileName={previewDoc?.filename || ""}
                showDownload
            />
        </div>
    );
}
