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
        return <ReactMarkdown key={index}>{trimmed}</ReactMarkdown>;
      })}
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
