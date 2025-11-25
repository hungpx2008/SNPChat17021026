import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, cn } from '@teable/ui-lib';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '../../context/app/i18n';
export const VirtualizedInfiniteTable = (props) => {
    const { rows, columns, className, fetchNextPage } = props;
    const { t } = useTranslation();
    const listRef = useRef(null);
    const fetchMoreOnBottomReached = useCallback((containerRefElement) => {
        if (containerRefElement) {
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
            const isReachedThreshold = scrollHeight - scrollTop - clientHeight < 30;
            if (isReachedThreshold) {
                fetchNextPage?.();
            }
        }
    }, [fetchNextPage]);
    useEffect(() => {
        fetchMoreOnBottomReached(listRef.current);
    }, [fetchMoreOnBottomReached]);
    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { rows: tableRows } = table.getRowModel();
    const rowVirtualizer = useVirtualizer({
        count: tableRows.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 40,
        overscan: 3,
    });
    const virtualRows = rowVirtualizer.getVirtualItems();
    return (_jsx("div", { ref: listRef, className: cn('relative size-full overflow-auto', className), onScroll: (e) => fetchMoreOnBottomReached(e.target), children: _jsxs(Table, { className: "relative scroll-smooth", children: [_jsx(TableHeader, { className: "sticky top-0 z-10 bg-background", children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { className: "flex h-10 bg-background text-[13px] hover:bg-background", children: headerGroup.headers.map((header) => {
                            return (_jsx(TableHead, { className: "flex items-center px-0", style: {
                                    width: header.getSize(),
                                }, children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id));
                        }) }, headerGroup.id))) }), _jsx(TableBody, { style: {
                        position: 'relative',
                        height: `${rowVirtualizer.getTotalSize()}px`,
                    }, children: virtualRows?.length ? (_jsx(_Fragment, { children: virtualRows.map((virtualRow) => {
                            const row = tableRows[virtualRow.index];
                            if (!row)
                                return null;
                            return (_jsx(TableRow, { className: "flex text-[13px]", style: {
                                    height: `${virtualRow.size}px`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }, children: row.getVisibleCells().map((cell) => {
                                    return (_jsx(TableCell, { className: "flex h-10 items-center px-0", style: {
                                            width: cell.column.getSize(),
                                        }, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id));
                                }) }, row.id));
                        }) })) : (_jsx(TableRow, { className: "flex w-full", children: _jsx(TableCell, { colSpan: columns.length, className: "h-20 w-full text-center leading-[64px] text-gray-500", children: t('common.empty') }) })) })] }) }));
};
