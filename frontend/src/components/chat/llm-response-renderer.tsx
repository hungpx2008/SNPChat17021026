import ReactMarkdown from "react-markdown";
import { AutoTable } from "@/components/ui/auto-table";

export function LLMResponseRenderer({ content }: { content: string }) {
  const contentWithHtmlTables = convertMarkdownTablesToHtml(content);
  const parts = contentWithHtmlTables.split(/(<table[\s\S]*?<\/table>)/g);

  return (
    <div>
      {parts.map((part, index) => {
        const trimmed = part.trim();
        if (!trimmed) {
          return null;
        }
        if (trimmed.startsWith("<table")) {
          return <AutoTable key={index} htmlString={trimmed} />;
        }
        // Parse citation patterns and render as badges
        return <CitationAwareMarkdown key={index} content={trimmed} />;
      })}
    </div>
  );
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
    return <ReactMarkdown>{content}</ReactMarkdown>;
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
        return <ReactMarkdown key={`t-${i}`}>{trimmed}</ReactMarkdown>;
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
  return text.includes("<table") || /(^|\n)\s*\|[^|]+\|[^|]+\|/m.test(text);
}

function convertMarkdownTablesToHtml(markdown: string): string {
  const tableRegex = /((?:^\s*\|.*\|\s*(?:\n|$))+)/gm;

  return markdown.replace(tableRegex, (tableBlock) => {
    const normalizedBlock = tableBlock.replace(/\|\s*\|/g, "|\n|");
    const lines = normalizedBlock
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      return tableBlock;
    }

    const headerLine = lines[0];
    const separatorLine = lines[1];
    if (!/^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(separatorLine)) {
      return tableBlock;
    }

    const headers = splitMarkdownRow(headerLine);
    const bodyLines = lines.slice(2);
    const rows = bodyLines
      .map(splitMarkdownRow)
      .filter((row) => row.some((cell) => cell.length > 0));

    if (!headers.length || !rows.length) {
      return tableBlock;
    }

    const normalizedRows = rows.map((row) => {
      if (row.length < headers.length) {
        return [...row, ...Array(headers.length - row.length).fill("")];
      }
      if (row.length > headers.length) {
        return row.slice(0, headers.length);
      }
      return row;
    });

    const headerHtml = headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("");

    const bodyHtml = normalizedRows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");

    return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
  });
}

function splitMarkdownRow(line: string): string[] {
  const trimmed = line.replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
