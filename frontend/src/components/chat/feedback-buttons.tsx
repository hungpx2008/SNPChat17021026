'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chatBackend } from '@/services/chat-backend';

interface FeedbackButtonsProps {
    messageId: string;
    className?: string;
}

const DISLIKE_REASONS = [
    { value: 'sai_so_lieu', label: '📊 Sai số liệu' },
    { value: 'thieu_trich_dan', label: '📄 Thiếu trích dẫn' },
    { value: 'khong_lien_quan', label: '🔍 Không liên quan' },
    { value: 'khac', label: '💬 Khác' },
];

export function FeedbackButtons({ messageId, className }: FeedbackButtonsProps) {
    const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [sending, setSending] = useState(false);

    const handleLike = async () => {
        if (feedback || sending) return;
        setSending(true);
        try {
            await chatBackend.submitFeedback(messageId, true);
            setFeedback('liked');
        } catch (err) {
            console.error('Failed to submit feedback', err);
        } finally {
            setSending(false);
        }
    };

    const handleDislike = () => {
        if (feedback || sending) return;
        setShowReasonModal(true);
    };

    const submitDislike = async (reason: string) => {
        setSending(true);
        try {
            await chatBackend.submitFeedback(messageId, false, reason);
            setFeedback('disliked');
            setShowReasonModal(false);
        } catch (err) {
            console.error('Failed to submit feedback', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={cn('relative', className)}>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-6 w-6 rounded-full',
                        feedback === 'liked' && 'bg-green-100 text-green-600 opacity-100',
                    )}
                    onClick={handleLike}
                    disabled={!!feedback || sending}
                    title="Câu trả lời tốt"
                >
                    <ThumbsUp size={12} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-6 w-6 rounded-full',
                        feedback === 'disliked' && 'bg-red-100 text-red-600 opacity-100',
                    )}
                    onClick={handleDislike}
                    disabled={!!feedback || sending}
                    title="Câu trả lời chưa tốt"
                >
                    <ThumbsDown size={12} />
                </Button>
            </div>

            {/* Reason Modal */}
            {showReasonModal && (
                <div className="absolute bottom-full left-0 mb-1 z-50 animate-in slide-in-from-bottom-2 fade-in duration-150">
                    <div className="bg-popover border rounded-lg shadow-lg p-3 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">Chọn lý do:</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => setShowReasonModal(false)}
                            >
                                <X size={12} />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            {DISLIKE_REASONS.map(reason => (
                                <Button
                                    key={reason.value}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs h-7"
                                    onClick={() => void submitDislike(reason.value)}
                                    disabled={sending}
                                >
                                    {reason.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
