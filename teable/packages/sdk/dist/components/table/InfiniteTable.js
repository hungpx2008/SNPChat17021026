import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table, cn } from '@teable/ui-lib';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '../../context/app/i18n';
export const InfiniteTable = (props) => {
    const { rows, columns, className, fetchNextPage } = props;
    const { t } = useTranslation();
    const listRef = useRef(null);
    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const fetchMoreOnBottomReached = useCallback((containerRefElement) => {
        if (containerRefElement) {
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
            const isReachedThreshold = scrollHeight - scrollTop - clientHeight < 30;
            if (!isReachedThreshold)
                return;
            fetchNextPage?.();
        }
    }, [fetchNextPage]);
    useEffect(() => {
        fetchMoreOnBottomReached(listRef.current);
    }, [fetchMoreOnBottomReached]);
    return (_jsx("div", { ref: listRef, className: cn('relative size-full overflow-auto px-2', className), onScroll: (e) => fetchMoreOnBottomReached(e.target), children: _jsxs(Table, { className: "relative scroll-smooth", children: [_jsx(TableHeader, { className: "sticky top-0 z-10 bg-background", children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { className: "flex h-10 bg-background text-[13px] hover:bg-background", children: headerGroup.headers.map((header) => {
                            const width = header.getSize();
                            const isAutoSize = width === Number.MAX_SAFE_INTEGER;
                            return (_jsx(TableHead, { className: cn('flex items-center px-0', isAutoSize && 'flex-1'), style: {
                                    minWidth: header.column.columnDef.minSize,
                                    width: isAutoSize ? undefined : width,
                                }, children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id));
                        }) }, headerGroup.id))) }), _jsx(TableBody, { children: table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { className: "flex text-[13px]", children: row.getVisibleCells().map((cell) => {
                            const width = cell.column.getSize();
                            const isAutoSize = width === Number.MAX_SAFE_INTEGER;
                            return (_jsx(TableCell, { className: cn('flex min-h-[40px] items-center px-0 overflow-hidden', isAutoSize && 'flex-1'), style: {
                                    minWidth: cell.column.columnDef.minSize,
                                    width: isAutoSize ? undefined : width,
                                }, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id));
                        }) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: t('common.empty') }) })) })] }) }));
};
