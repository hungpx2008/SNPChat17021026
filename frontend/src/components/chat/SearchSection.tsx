'use client';

import { LoaderCircle } from 'lucide-react';

type TranslateFn = (key: string) => string;

export interface ChatSearchResult {
  text: string;
  score: number;
  source: string;
  metadata: Record<string, any>;
}

export interface SearchSectionProps {
  searchResults: ChatSearchResult[];
  searchLoading?: boolean;
  onSearchResultSelect?: (result: ChatSearchResult) => void;
  t: TranslateFn;
}

export function SearchSection({
  searchResults,
  searchLoading,
  onSearchResultSelect,
  t,
}: SearchSectionProps) {
  if (searchLoading) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        <span>{t('thinkingMessage')}</span>
      </div>
    );
  }

  if (searchResults.length === 0) return null;

  return (
    <div className="mt-2 space-y-1 rounded-md border bg-card p-2">
      {searchResults.map((result, index) => (
        <button
          key={`${result.metadata?.session_id ?? index}-${index}`}
          type="button"
          className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none"
          onClick={() => onSearchResultSelect?.(result)}
        >
          <p className="line-clamp-2">{result.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Score: {Number.isFinite(result.score) ? result.score.toFixed(2) : '--'}
          </p>
        </button>
      ))}
    </div>
  );
}
