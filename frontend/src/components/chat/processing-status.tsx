'use client';

import { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentMode } from './chat-composer';

const STATUS_MESSAGES: Record<AgentMode, string[]> = {
    auto: [
        'Đang phân loại câu hỏi...',
        'Đang tìm phương án tốt nhất...',
        'Đang truy xuất dữ liệu...',
        'Đang biên soạn câu trả lời...',
    ],
    sql: [
        'Đang phân tích câu hỏi...',
        'Đang truy vấn cơ sở dữ liệu...',
        'Đang tổng hợp kết quả...',
        'Đang biên soạn câu trả lời...',
    ],
    rag: [
        'Đang tìm tài liệu liên quan...',
        'Đang trích xuất thông tin...',
        'Đang phân tích nội dung...',
        'Đang biên soạn câu trả lời...',
    ],
    chat: [
        'Đang suy nghĩ...',
    ],
};

interface ProcessingStatusProps {
    mode: AgentMode;
    className?: string;
}

export function ProcessingStatus({ mode, className }: ProcessingStatusProps) {
    const messages = STATUS_MESSAGES[mode] || STATUS_MESSAGES.chat;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (messages.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <LoaderCircle className="animate-spin h-5 w-5 text-primary/70" />
            <span
                key={index}
                className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
                {messages[index]}
            </span>
            <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                    />
                ))}
            </span>
        </div>
    );
}
