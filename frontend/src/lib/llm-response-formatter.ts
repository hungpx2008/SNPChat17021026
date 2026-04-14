/**
 * LLM Response Formatting Guidelines
 *
 * This file contains utilities and guidelines for improving LLM responses,
 * especially for table formatting from vector database content.
 */

/**
 * System prompt addition for better table formatting
 */
export const TABLE_FORMATTING_INSTRUCTIONS = `
Khi trả lời câu hỏi với thông tin từ tài liệu chứa bảng biểu hoặc giá cả:

1. KHÔNG bao giờ thêm dòng "💬 Lưu ý: Đây là thông tin thô từ tài liệu..." vào phản hồi
2. Khi có thông tin dạng bảng, hãy định dạng thành HTML table đẹp mắt:

**Ví dụ định dạng bảng HTML:**
<table>
<thead>
  <tr>
    <th>Loại container</th>
    <th>20'</th>
    <th>40' & 45'</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Từ ngày thứ 1 - ngày thứ 2</td>
    <td>Miễn phụ thu</td>
    <td>Miễn phụ thu</td>
  </tr>
  <tr>
    <td>Từ ngày thứ 3 - ngày thứ 4</td>
    <td>505.000</td>
    <td>900.000</td>
  </tr>
</tbody>
</table>

3. Sử dụng định dạng tiền tệ rõ ràng (VNĐ)
4. Căn chỉnh số liệu trong bảng
5. Thêm header rõ ràng cho từng cột
6. Tóm tắt thông tin quan trọng sau bảng nếu cần

**Lưu ý quan trọng:**
- Luôn loại bỏ các ghi chú hệ thống như "💬 Lưu ý..."
- Đảm bảo bảng HTML có cấu trúc đúng với <thead> và <tbody>
- Sử dụng đơn vị tiền tệ Việt Nam (VNĐ)
- Format số theo chuẩn Việt Nam (dấu chấm ngăn cách hàng nghìn)
`;

/**
 * Enhanced table detection and formatting for Vietnamese content
 */
export function detectAndFormatVietnameseTable(content: string): string {
  // Patterns for Vietnamese pricing tables
  const patterns = [
    // Container pricing patterns
    /(?:Loại container|20'|40'|container)[\s\S]*?(?:VNĐ|vnđ|\d{1,3}(?:\.\d{3})+)/gi,

    // Service fee patterns
    /(?:Phụ thu|Dịch vụ|Biểu giá)[\s\S]*?\d{1,3}(?:\.\d{3})+/gi,

    // Time-based pricing
    /(?:Từ ngày|ngày thứ|trong vòng)[\s\S]*?\d{1,3}(?:\.\d{3})+/gi,
  ];

  let formatted = content;

  patterns.forEach(pattern => {
    formatted = formatted.replace(pattern, (match) => {
      return convertToHtmlTable(match);
    });
  });

  return formatted;
}

/**
 * Convert detected table content to HTML table
 */
function convertToHtmlTable(tableText: string): string {
  const lines = tableText.split('\n').filter(line => line.trim());

  if (lines.length < 2) return tableText;

  // Detect header and data rows
  const headerKeywords = ['Loại', 'container', '20\'', '40\'', 'Từ ngày', 'Thời gian'];
  const headerIndex = lines.findIndex(line =>
    headerKeywords.some(keyword => line.includes(keyword))
  );

  if (headerIndex === -1) return tableText;

  const headerLine = lines[headerIndex];
  const dataLines = lines.slice(headerIndex + 1).filter(line =>
    /\d{1,3}(?:\.\d{3})*/.test(line) // Contains formatted numbers
  );

  if (dataLines.length === 0) return tableText;

  // Parse header
  const headers = parseTableRow(headerLine);

  // Parse data rows
  const rows = dataLines.map(line => parseTableRow(line));

  // Generate HTML
  let html = '<table>\n<thead>\n  <tr>\n';
  headers.forEach(header => {
    html += `    <th>${escapeHtml(header)}</th>\n`;
  });
  html += '  </tr>\n</thead>\n<tbody>\n';

  rows.forEach(row => {
    html += '  <tr>\n';
    row.forEach((cell, index) => {
      // Format currency if it's a number
      let formattedCell = cell;
      if (/^\d{1,3}(?:\.\d{3})*$/.test(cell)) {
        formattedCell = `${cell} VNĐ`;
      }
      html += `    <td>${escapeHtml(formattedCell)}</td>\n`;
    });
    html += '  </tr>\n';
  });

  html += '</tbody>\n</table>';

  return html;
}

/**
 * Parse a table row, handling Vietnamese text and prices
 */
function parseTableRow(line: string): string[] {
  // Remove extra whitespace
  const cleaned = line.trim();

  // Split by multiple spaces or tabs, but preserve single spaces in text
  const parts = cleaned.split(/\s{2,}|\t/).filter(part => part.trim());

  if (parts.length > 1) return parts;

  // Alternative parsing for lines with mixed content
  const pricePattern = /\d{1,3}(?:\.\d{3})*/g;
  const prices = [...cleaned.matchAll(pricePattern)];

  if (prices.length === 0) return [cleaned];

  const result: string[] = [];
  let lastIndex = 0;

  prices.forEach(match => {
    if (match.index !== undefined) {
      const beforePrice = cleaned.substring(lastIndex, match.index).trim();
      if (beforePrice) result.push(beforePrice);
      result.push(match[0]);
      lastIndex = match.index + match[0].length;
    }
  });

  const remaining = cleaned.substring(lastIndex).trim();
  if (remaining) result.push(remaining);

  return result.length > 1 ? result : [cleaned];
}

/**
 * Escape HTML for safe rendering
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Clean up response content by removing system notes
 */
export function cleanSystemNotes(content: string): string {
  return content
    .replace(/💬\s*Lưu ý:\s*Đây là thông tin thô từ tài liệu[^📚]*/gi, '')
    .replace(/💬\s*Lưu ý:[^\n]*bạn có thể hỏi cụ thể hơn[^\n]*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}