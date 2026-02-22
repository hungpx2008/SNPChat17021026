'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, Loader2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TTSButtonProps {
    text: string;
    className?: string;
}

export function TTSButton({ text, className }: TTSButtonProps) {
    const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    const handleClick = useCallback(async () => {
        if (state === 'playing') {
            // Stop audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setState('idle');
            return;
        }

        if (state === 'loading') return;

        setState('loading');
        try {
            // Strip markdown formatting for cleaner TTS
            const cleanText = text
                .replace(/\*\*(.+?)\*\*/g, '$1')    // Bold
                .replace(/\*(.+?)\*/g, '$1')         // Italic
                .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // Links
                .replace(/#{1,6}\s+/g, '')           // Headers
                .replace(/```[\s\S]*?```/g, '')      // Code blocks
                .replace(/`(.+?)`/g, '$1')           // Inline code
                .replace(/\|.*\|/g, '')              // Table rows
                .slice(0, 1000);                     // Max 1000 chars for TTS

            const resp = await fetch(`${backendUrl}/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: cleanText }),
            });

            if (!resp.ok) throw new Error('TTS failed');

            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setState('idle');
                URL.revokeObjectURL(url);
            };
            audio.onerror = () => {
                setState('idle');
                URL.revokeObjectURL(url);
            };

            await audio.play();
            setState('playing');
        } catch (err) {
            console.error('[TTS]', err);
            setState('idle');
        }
    }, [text, state, backendUrl]);

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                'h-7 w-7 rounded-full transition-all',
                state === 'playing' && 'text-primary bg-primary/10',
                state === 'loading' && 'opacity-60',
                className,
            )}
            onClick={handleClick}
            title={state === 'playing' ? 'Dừng phát' : 'Nghe giọng đọc'}
        >
            {state === 'loading' ? (
                <Loader2 size={14} className="animate-spin" />
            ) : state === 'playing' ? (
                <Square size={12} />
            ) : (
                <Volume2 size={14} />
            )}
        </Button>
    );
}
