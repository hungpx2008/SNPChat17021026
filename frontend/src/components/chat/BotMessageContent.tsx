'use client';

import { memo, useMemo } from 'react';
import { sanitizeBotContent } from '@/lib/content-sanitizers';
import { LLMResponseRenderer, containsTableMarkup } from './llm-response-renderer';
import { Typewriter } from '@/components/typewriter';

export interface BotMessageContentProps {
  content: string;
  isLast: boolean;
}

/** Memoized bot message renderer — sanitize only runs when content changes. */
export const BotMessageContent = memo(function BotMessageContent({
  content,
  isLast,
}: BotMessageContentProps) {
  const clean = useMemo(() => sanitizeBotContent(content), [content]);
  if (isLast && !containsTableMarkup(clean)) {
    return <Typewriter text={clean} speed={20} />;
  }
  return <LLMResponseRenderer content={clean} />;
});
