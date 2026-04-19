/**
 * Unit tests for content-sanitizers.ts
 *
 * Pure string → string functions — no DOM, no React needed.
 */
import {
  stripCodeBlocks,
  stripPythonTracebacks,
  stripRawErrorLines,
  cleanSystemNotes,
  deduplicateCitations,
  sanitizeBotContent,
} from '../lib/content-sanitizers';

// ---------------------------------------------------------------------------
// stripCodeBlocks
// ---------------------------------------------------------------------------

describe('stripCodeBlocks', () => {
  it('removes sql code blocks', () => {
    const input = 'Result:\n```sql\nSELECT * FROM users;\n```\nDone.';
    expect(stripCodeBlocks(input)).not.toContain('```sql');
    expect(stripCodeBlocks(input)).not.toContain('SELECT');
    expect(stripCodeBlocks(input)).toContain('Result:');
    expect(stripCodeBlocks(input)).toContain('Done.');
  });

  it('removes python code blocks', () => {
    const input = '```python\nprint("hello")\n```';
    expect(stripCodeBlocks(input)).not.toContain('print');
  });

  it('removes bash code blocks', () => {
    const input = '```bash\nls -la\n```';
    expect(stripCodeBlocks(input)).not.toContain('ls -la');
  });

  it('removes json code blocks', () => {
    const input = '```json\n{"key": "value"}\n```';
    expect(stripCodeBlocks(input)).not.toContain('"key"');
  });

  it('preserves regular text', () => {
    const input = 'Normal text without code blocks.';
    expect(stripCodeBlocks(input)).toBe(input);
  });

  it('preserves non-matched language blocks', () => {
    // Only sql, python, bash, sh, javascript, json are stripped
    const input = '```rust\nfn main() {}\n```';
    expect(stripCodeBlocks(input)).toContain('fn main()');
  });
});

// ---------------------------------------------------------------------------
// stripPythonTracebacks
// ---------------------------------------------------------------------------

describe('stripPythonTracebacks', () => {
  it('removes a full traceback', () => {
    const input =
      'Before.\nTraceback (most recent call last):\n  File "app.py", line 1\nValueError: bad value\nAfter.';
    const result = stripPythonTracebacks(input);
    expect(result).not.toContain('Traceback');
    expect(result).not.toContain('ValueError');
    expect(result).toContain('Before.');
    expect(result).toContain('After.');
  });

  it('leaves text without tracebacks unchanged', () => {
    const input = 'Everything is fine.';
    expect(stripPythonTracebacks(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// stripRawErrorLines
// ---------------------------------------------------------------------------

describe('stripRawErrorLines', () => {
  it('removes sqlalchemy error lines', () => {
    const input = 'Result:\nsqlalchemy.exc.OperationalError: connection refused\nDone.';
    const result = stripRawErrorLines(input);
    expect(result).not.toContain('OperationalError');
    expect(result).toContain('Result:');
    expect(result).toContain('Done.');
  });

  it('removes generic Error lines', () => {
    const input = 'RuntimeError: something went wrong';
    expect(stripRawErrorLines(input)).not.toContain('RuntimeError');
  });

  it('removes Exception lines', () => {
    const input = 'custom.module.CustomException: detail here';
    expect(stripRawErrorLines(input)).not.toContain('CustomException');
  });

  it('preserves normal text', () => {
    const input = 'No errors here, just text.';
    expect(stripRawErrorLines(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// cleanSystemNotes
// ---------------------------------------------------------------------------

describe('cleanSystemNotes', () => {
  it('removes "Lưu ý: Đây là thông tin thô" note', () => {
    const input = 'Kết quả tốt.\n💬 Lưu ý: Đây là thông tin thô từ tài liệu nội bộ.';
    const result = cleanSystemNotes(input);
    expect(result).not.toContain('thông tin thô');
    expect(result).toContain('Kết quả tốt.');
  });

  it('removes "bạn có thể hỏi cụ thể hơn" note', () => {
    const input = 'Data here.\n💬 Lưu ý: bạn có thể hỏi cụ thể hơn để có kết quả tốt hơn.';
    const result = cleanSystemNotes(input);
    expect(result).not.toContain('hỏi cụ thể hơn');
  });

  it('preserves normal text', () => {
    const input = 'Nothing to clean.';
    expect(cleanSystemNotes(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// deduplicateCitations
// ---------------------------------------------------------------------------

describe('deduplicateCitations', () => {
  it('removes duplicate citations', () => {
    const input =
      '**[Nguồn: report.pdf, Trang 5]** (điểm: 0.85)\n' +
      '**[Nguồn: report.pdf, Trang 5]** (điểm: 0.85)';
    const result = deduplicateCitations(input);
    // Should only contain one instance
    const matches = result.match(/\*\*\[Nguồn: report\.pdf, Trang 5\]\*\*/g);
    expect(matches).toHaveLength(1);
  });

  it('keeps distinct citations', () => {
    const input =
      '**[Nguồn: a.pdf, Trang 1]** (điểm: 0.9)\n' +
      '**[Nguồn: b.pdf, Trang 2]** (điểm: 0.8)';
    const result = deduplicateCitations(input);
    expect(result).toContain('a.pdf');
    expect(result).toContain('b.pdf');
  });

  it('handles text without citations', () => {
    const input = 'No citations here.';
    expect(deduplicateCitations(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// sanitizeBotContent (full pipeline)
// ---------------------------------------------------------------------------

describe('sanitizeBotContent', () => {
  it('strips code blocks and collapses blank lines', () => {
    const input = 'Hello.\n\n```sql\nSELECT 1;\n```\n\n\n\nWorld.';
    const result = sanitizeBotContent(input);
    expect(result).not.toContain('```sql');
    expect(result).not.toContain('\n\n\n');
    expect(result).toContain('Hello.');
    expect(result).toContain('World.');
  });

  it('strips tracebacks and error lines together', () => {
    const input =
      'Info.\nTraceback (most recent call last):\n  File "x.py"\nKeyError: oops\nhttpx.ReadError: conn reset';
    const result = sanitizeBotContent(input);
    expect(result).not.toContain('Traceback');
    expect(result).not.toContain('KeyError');
    expect(result).not.toContain('ReadError');
    expect(result).toContain('Info.');
  });

  it('deduplicates citations after other sanitization', () => {
    const input =
      '**[Nguồn: doc.pdf, Trang 1]** (điểm: 0.9)\n' +
      '**[Nguồn: doc.pdf, Trang 1]** (điểm: 0.9)';
    const result = sanitizeBotContent(input);
    const matches = result.match(/\*\*\[Nguồn: doc\.pdf, Trang 1\]\*\*/g);
    expect(matches).toHaveLength(1);
  });

  it('returns trimmed result', () => {
    const input = '  \n\nHello world.\n\n  ';
    const result = sanitizeBotContent(input);
    expect(result).toBe('Hello world.');
  });

  it('handles empty string', () => {
    expect(sanitizeBotContent('')).toBe('');
  });

  it('preserves legitimate Vietnamese content', () => {
    const input = 'Cảng Cát Lái xử lý 6.5 triệu TEU mỗi năm.';
    expect(sanitizeBotContent(input)).toBe(input);
  });
});
