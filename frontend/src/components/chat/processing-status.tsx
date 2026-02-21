'use client';

import { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentMode } from './chat-composer';

const STATUS_MESSAGES: Record<AgentMode, string[]> = {
    auto: [
        'Đang phân tích yêu cầu...',
        'Đang lập kế hoạch truy vấn...',
        'Đang chọn công cụ phù hợp...',
        'Đang tổng hợp thông tin...',
    ],
    sql: [
        'Đang phân tích câu hỏi số liệu...',
        'Đang soạn câu lệnh SQL...',
        'Đang kiểm tra độ chính xác...',
        'Đang biên soạn báo cáo...',
    ],
    rag: [
        'Đang tìm tài liệu liên quan...',
        'Đang trích xuất dữ liệu...',
        'Đang kiểm tra tính xác thực...',
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
