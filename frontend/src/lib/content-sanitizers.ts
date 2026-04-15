/**
 * Content sanitization pipeline for LLM bot responses.
 *
 * Consolidates sanitization logic previously duplicated in
 * chat-message-list.tsx and llm-response-formatter.ts.
 */

/** Remove code blocks (sql, python, bash, sh, javascript, json) that LLM might accidentally include. */
export function stripCodeBlocks(content: string): string {
  return content.replace(/```(?:sql|python|bash|sh|javascript|json)\s*\n[\s\S]*?```/gi, '');
}

/** Remove Python tracebacks: "Traceback (most recent call last):..." through the error line. */
export function stripPythonTracebacks(content: string): string {
  return content.replace(
    /Traceback \(most recent call last\):[\s\S]*?(?:\w+Error:.+)/g,
    '',
  );
}

/** Remove raw error lines like "sqlalchemy.exc.OperationalError: ...". */
export function stripRawErrorLines(content: string): string {
  return content.replace(/^[\w.]+(?:Error|Exception):.+$/gm, '');
}

/** Remove unwanted system notes (Vietnamese advisory text). */
export function cleanSystemNotes(content: string): string {
  return content
    .replace(/💬\s*Lưu ý:\s*Đây là thông tin thô từ tài liệu[^📚]*/gi, '')
    .replace(/💬\s*Lưu ý:[^\n]*bạn có thể hỏi cụ thể hơn[^\n]*/gi, '');
}

/**
 * Deduplicate citations that reference the same filename+page.
 * Pattern: **[Nguồn: file.pdf, Trang X]** (điểm: Y.YY)
 */
export function deduplicateCitations(content: string): string {
  const citationRegex = /\*\*\[Nguồn:.+?\]\*\*(?:\s*\(điểm:.+?\))?/g;
  const seen = new Set<string>();
  return content.replace(citationRegex, (match) => {
    // Normalize key: extract just filename + page
    const key = match.replace(/\(điểm:.+?\)/, '').trim();
    if (seen.has(key)) return '';
    seen.add(key);
    return match;
  });
}

/**
 * Full sanitization pipeline for bot responses.
 * Applies all sanitizers in sequence, then cleans up excess blank lines.
 */
export function sanitizeBotContent(content: string): string {
  let text = content;
  text = stripCodeBlocks(text);
  text = stripPythonTracebacks(text);
  text = stripRawErrorLines(text);
  text = cleanSystemNotes(text);
  text = deduplicateCitations(text);
  // Clean up excess blank lines left after stripping
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
}
