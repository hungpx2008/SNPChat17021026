'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BranchInfo } from "@/services/chat-backend";

interface BranchNavigatorProps {
  branchInfo: BranchInfo;
  onNavigate: (direction: "prev" | "next") => void;
  loading?: boolean;
}

export function BranchNavigator({ branchInfo, onNavigate, loading }: BranchNavigatorProps) {
  if (branchInfo.total_branches <= 1) return null;

  const currentDisplay = branchInfo.current_index + 1;
  const isFirst = branchInfo.current_index === 0;
  const isLast = branchInfo.current_index === branchInfo.total_branches - 1;

  return (
    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onNavigate("prev")}
        disabled={isFirst || loading}
        aria-label="Nhanh truoc"
      >
        <ChevronLeft size={14} />
      </Button>
      <span className="min-w-[3ch] text-center tabular-nums">
        {currentDisplay}/{branchInfo.total_branches}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onNavigate("next")}
        disabled={isLast || loading}
        aria-label="Nhanh sau"
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}
