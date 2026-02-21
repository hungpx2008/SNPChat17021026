
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface AutoTableProps {
  htmlString: string;
}

const parseHTMLTable = (htmlString: string): TableData | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      return null;
    }

    const headers: string[] = [];
    const rows: string[][] = [];

    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('tr th').forEach(th => {
        headers.push(th.textContent || '');
      });
    }

    if (headers.length === 0) {
      const firstRowCells = table.querySelectorAll('tr:first-child th, tr:first-child td');
      firstRowCells.forEach(cell => {
        headers.push(cell.textContent || '');
      });
    }

    const tbody = table.querySelector('tbody');
    if (tbody) {
      const trs = tbody.querySelectorAll('tr');
      trs.forEach((tr, rowIndex) => {
        if (headers.length > 0 && !thead && rowIndex === 0) {
          return;
        }
        const row: string[] = [];
        tr.querySelectorAll('td').forEach(td => {
          row.push(td.innerHTML || '');
        });
        if (row.length > 0) {
          rows.push(row);
        }
      });
    }

    return { headers, rows };
  } catch (error) {
    console.error("Failed to parse HTML table:", error);
    return null;
  }
};

type SortDir = 'asc' | 'desc' | null;

export function AutoTable({ htmlString }: AutoTableProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  useEffect(() => {
    setTableData(parseHTMLTable(htmlString));
  }, [htmlString]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    if (!tableData) return [];
    let rows = tableData.rows;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(row =>
        row.some(cell => {
          // Strip HTML tags for search
          const text = cell.replace(/<[^>]*>/g, '').toLowerCase();
          return text.includes(q);
        })
      );
    }

    // Sort
    if (sortCol !== null && sortDir) {
      rows = [...rows].sort((a, b) => {
        const aVal = (a[sortCol] || '').replace(/<[^>]*>/g, '').trim();
        const bVal = (b[sortCol] || '').replace(/<[^>]*>/g, '').trim();

        // Try numeric comparison first
        const aNum = parseFloat(aVal.replace(/[,.\s]/g, ''));
        const bNum = parseFloat(bVal.replace(/[,.\s]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Fallback to string comparison
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal, 'vi')
          : bVal.localeCompare(aVal, 'vi');
      });
    }

    return rows;
  }, [tableData, searchQuery, sortCol, sortDir]);

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      // Cycle: asc → desc → none
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortCol(colIndex);
      setSortDir('asc');
    }
  };

  if (!tableData || tableData.headers.length === 0 || tableData.rows.length === 0) {
    return <ReactMarkdown>{htmlString}</ReactMarkdown>;
  }

  return (
    <div className="my-4 not-prose space-y-2">
      {/* Search input — only show for tables with 3+ rows */}
      {tableData.rows.length >= 3 && (
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm trong bảng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      )}

      <ScrollArea className="max-w-full overflow-x-auto rounded-lg border shadow-md">
        <Table className="min-w-full bg-card">
          <TableHeader className="bg-muted/50">
            <TableRow>
              {tableData.headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="px-4 py-3 font-bold text-muted-foreground whitespace-nowrap cursor-pointer select-none hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort(index)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {sortCol === index ? (
                      sortDir === 'asc' ? <ArrowUp size={12} className="text-primary" />
                        : <ArrowDown size={12} className="text-primary" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-30" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tableData.headers.length} className="text-center py-4 text-muted-foreground">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/30 even:bg-muted/10">
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="px-4 py-3 align-top prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Result count */}
      {searchQuery && (
        <p className="text-[10px] text-muted-foreground">
          {filteredRows.length}/{tableData.rows.length} dòng
        </p>
      )}
    </div>
  );
}
