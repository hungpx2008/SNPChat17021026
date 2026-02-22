'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Upload, RefreshCw, Search, Clock, CheckCircle2, XCircle, Loader2, AlertTriangle, Zap, Microscope, Eye, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { chatBackend, type DocumentInfo } from '@/services/chat-backend';

interface DocumentSidebarProps {
    userId: string;
    onAskAboutDocument: (filename: string) => void;
    visible: boolean;
    /** Bump để ép reload danh sách tài liệu (khi upload xong). */
    refreshToken?: number;
}

const STATUS_CONFIG: Record<string, { icon: any; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; animate: boolean }> = {
    processing: { icon: Loader2, label: 'Đang xử lý...', variant: 'secondary', animate: true },
    awaiting_choice: { icon: AlertTriangle, label: 'Chọn phương thức', variant: 'outline', animate: false },
    ready: { icon: CheckCircle2, label: 'Sẵn sàng', variant: 'default', animate: false },
    error: { icon: XCircle, label: 'Lỗi', variant: 'destructive', animate: false },
};

export function DocumentSidebar({ userId, onAskAboutDocument, visible, refreshToken }: DocumentSidebarProps) {
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [choosingEngine, setChoosingEngine] = useState<string | null>(null); // doc id being processed
    const [previewDoc, setPreviewDoc] = useState<DocumentInfo | null>(null);

    // Build preview/download URL from document id
    const previewUrl = useMemo(
        () => previewDoc ? chatBackend.getDocumentDownloadUrl(previewDoc.id) : '',
        [previewDoc],
    );

    const loadDocuments = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const docs = await chatBackend.listDocuments(userId);
            setDocuments(docs);
        } catch (err) {
            console.error('Failed to load documents', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (visible) {
            void loadDocuments();
        }
    }, [visible, loadDocuments]);

    // Reload when external trigger bumps (e.g., after upload completes)
    useEffect(() => {
        if (visible) {
            void loadDocuments();
        }
    }, [refreshToken, visible, loadDocuments]);

    // Auto-refresh processing/awaiting_choice documents every 5s
    useEffect(() => {
        const hasActive = documents.some(d => d.status === 'processing' || d.status === 'awaiting_choice');
        if (!hasActive || !visible) return;

        const interval = setInterval(() => {
            void loadDocuments();
        }, 5000);
        return () => clearInterval(interval);
    }, [documents, visible, loadDocuments]);

    const handleChooseEngine = async (docId: string, engine: 'kreuzberg' | 'docling') => {
        setChoosingEngine(docId);
        try {
            await chatBackend.chooseDocumentEngine(docId, engine);
            // Update local state immediately
            setDocuments(prev =>
                prev.map(d => d.id === docId ? { ...d, status: 'processing' as const, extractor_used: engine } : d)
            );
        } catch (err) {
            console.error('Engine choice failed', err);
            alert('Không thể chọn phương thức xử lý. Vui lòng thử lại.');
        } finally {
            setChoosingEngine(null);
        }
    };

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
                            const analysis = (doc as any).meta?.analysis;
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
                                                        {doc.extractor_used === 'docling' ? '🔬 DL' : '⚡ KB'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ====== AWAITING_CHOICE — Engine selection buttons ====== */}
                                    {doc.status === 'awaiting_choice' && (
                                        <div className="mt-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                            <p className="text-[11px] text-amber-700 dark:text-amber-300 mb-2 leading-snug">
                                                ⚠️ Tài liệu phức tạp{analysis?.reason ? ` (${analysis.reason})` : ''}.
                                                Đại ca chọn phương án xử lý:
                                            </p>
                                            <div className="flex gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-7 text-[10px] border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950"
                                                    disabled={choosingEngine === doc.id}
                                                    onClick={() => handleChooseEngine(doc.id, 'kreuzberg')}
                                                >
                                                    <Zap size={12} className="mr-1 text-blue-500" />
                                                    Nhanh - KB
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-7 text-[10px] border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950"
                                                    disabled={choosingEngine === doc.id}
                                                    onClick={() => handleChooseEngine(doc.id, 'docling')}
                                                >
                                                    <Microscope size={12} className="mr-1 text-purple-500" />
                                                    Sâu - DL
                                                </Button>
                                            </div>
                                            {choosingEngine === doc.id && (
                                                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                                    <Loader2 size={10} className="animate-spin" />
                                                    Đang gửi yêu cầu...
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ====== PROCESSING with Docling — progress message ====== */}
                                    {doc.status === 'processing' && doc.extractor_used === 'docling' && (
                                        <div className="mt-2 p-2 rounded-md bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                            <p className="text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                                <Microscope size={12} className="shrink-0" />
                                                🔬 Đang phân tích sâu tài liệu... đợi em chút nhé
                                            </p>
                                            <div className="mt-1.5 w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* ====== PROCESSING (generic) — cancel button ====== */}
                                    {doc.status === 'processing' && doc.extractor_used !== 'docling' && (
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
                                            ❌ Hủy xử lý
                                        </Button>
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
            <Dialog open={!!previewDoc} onOpenChange={(open) => { if (!open) setPreviewDoc(null); }}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0">
                    <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0 shrink-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={16} className="text-primary shrink-0" />
                            <DialogTitle className="text-sm truncate">
                                {previewDoc?.filename}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="sr-only">
                            Xem trước tài liệu và tải về
                        </DialogDescription>
                        <a
                            href={previewUrl}
                            download={previewDoc?.filename}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 ml-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download size={14} />
                            Tải về
                        </a>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden bg-muted/30">
                        {previewUrl && (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title={previewDoc?.filename || 'Document preview'}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
