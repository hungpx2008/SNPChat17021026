import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LLMResponseRenderer({ content }: { content: string }) {
  const normalized = content
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return <CitationAwareMarkdown content={normalized} />;
}

/**
 * Renders markdown content with citation badges.
 * Parses **[Nguồn: filename, Trang X]** patterns into styled badges.
 */
function CitationAwareMarkdown({ content }: { content: string }) {
  // Split by citation pattern: **[Nguồn: ...]** (with or without score)
  const citationRegex = /\*\*\[Nguồn:\s*(.+?)\]\*\*(?:\s*\(điểm:\s*([\d.]+)\))?/g;
  const parts: Array<{ type: 'text' | 'citation'; value: string; score?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'citation', value: match[1], score: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  // If no citations found, render as plain markdown
  if (parts.length === 1 && parts[0].type === 'text') {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
  }

  // Deduplicate citations by filename+page (keep highest score)
  const allCitations = parts.filter(p => p.type === 'citation');
  const seenCitations = new Map<string, { value: string; score?: string }>();
  for (const c of allCitations) {
    const key = c.value.trim().toLowerCase();
    const existing = seenCitations.get(key);
    if (!existing || (c.score && (!existing.score || parseFloat(c.score) > parseFloat(existing.score)))) {
      seenCitations.set(key, { value: c.value, score: c.score });
    }
  }
  const uniqueCitations = Array.from(seenCitations.values());

  // Separate text parts from citations
  const textParts = parts.filter(p => p.type === 'text');

  return (
    <div>
      {textParts.map((part, i) => {
        const trimmed = part.value.trim();
        if (!trimmed) return null;
        return <ReactMarkdown key={`t-${i}`} remarkPlugins={[remarkGfm]}>{trimmed}</ReactMarkdown>;
      })}
      {uniqueCitations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {uniqueCitations.map((c, i) => {
            // Extract filename from citation like "Biểu giá dịch vụ.pdf, Trang 1"
            const filename = c.value.split(",")[0].trim();
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const downloadUrl = `${backendUrl}/upload/find-by-name?filename=${encodeURIComponent(filename)}`;

            return (
              <a
                key={`c-${i}`}
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const resp = await fetch(downloadUrl);
                    if (resp.ok) {
                      const data = await resp.json();
                      window.open(`${backendUrl}${data.download_url}`, "_blank");
                    } else {
                      alert(`Không tìm thấy tài liệu: ${filename}`);
                    }
                  } catch {
                    alert(`Lỗi khi tải tài liệu: ${filename}`);
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 hover:shadow-sm transition-all no-underline"
                title={`Nhấn để mở: ${filename}${c.score ? ` (Relevance: ${c.score})` : ""}`}
              >
                📄 {c.value}
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function containsTableMarkup(text: string): boolean {
  // Check for HTML tables
  if (/<table[\s\S]*?<\/table>/i.test(text)) return true;
  // Check for Markdown tables: line with pipes followed by separator line
  return /^\s*\|.+\|.*\n\s*\|[\s:|-]+\|/m.test(text);
}
