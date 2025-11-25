import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useInfiniteQuery } from '@tanstack/react-query';
import { FieldType, validateCellValue } from '@teable/core';
import { ArrowRight, ChevronRight, MagicAi } from '@teable/icons';
import { getRecordHistory, getRecordListHistory } from '@teable/openapi';
import { Button, cn } from '@teable/ui-lib';
import dayjs from 'dayjs';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { ReactQueryKeys } from '../../config';
import { useTranslation } from '../../context/app/i18n';
import { useFieldStaticGetter, useIsHydrated, useTableId } from '../../hooks';
import { CellValue } from '../cell-value';
import { OverflowTooltip } from '../cell-value/components';
import { CollaboratorWithHoverCard } from '../collaborator';
import { InfiniteTable } from '../table';
import { CopyButton } from './components';
const SUPPORTED_COPY_FIELD_TYPES = [FieldType.SingleLineText, FieldType.LongText];
export const RecordHistory = (props) => {
    const { recordId, onRecordClick } = props;
    const tableId = useTableId();
    const { t } = useTranslation();
    const isHydrated = useIsHydrated();
    const getFieldStatic = useFieldStaticGetter();
    const [nextCursor, setNextCursor] = useState();
    const [userMap, setUserMap] = useState({});
    const queryFn = async ({ queryKey, pageParam }) => {
        const recordId = queryKey[2];
        const res = recordId
            ? await getRecordHistory(queryKey[1], recordId, {
                cursor: pageParam,
            })
            : await getRecordListHistory(queryKey[1], {
                cursor: pageParam,
            });
        setNextCursor(() => res.data.nextCursor);
        setUserMap((prev) => ({ ...prev, ...res.data.userMap }));
        return res.data.historyList;
    };
    const { data, isFetching, isLoading, fetchNextPage } = useInfiniteQuery({
        queryKey: ReactQueryKeys.getRecordHistory(tableId, recordId),
        queryFn,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
        getNextPageParam: () => nextCursor,
    });
    const allRows = useMemo(() => (data ? data.pages.flatMap((d) => d) : []), [data]);
    const columns = useMemo(() => {
        const actionVisible = !recordId && onRecordClick;
        const tableColumns = [
            {
                accessorKey: 'createdTime',
                header: t('expandRecord.recordHistory.createdTime'),
                size: 90,
                cell: ({ row }) => {
                    const createdTime = row.getValue('createdTime');
                    const createdDate = dayjs(createdTime);
                    const isToday = createdDate.isSame(dayjs(), 'day');
                    return (_jsx("div", { className: "text-xs", title: createdDate.format('YYYY/MM/DD HH:mm'), children: createdDate.format(isToday ? 'HH:mm' : 'YYYY/MM/DD') }));
                },
            },
            {
                accessorKey: 'createdBy',
                header: t('expandRecord.recordHistory.createdBy'),
                size: 80,
                cell: ({ row }) => {
                    const createdBy = row.getValue('createdBy');
                    const user = userMap[createdBy];
                    if (!user)
                        return null;
                    const { id, name, avatar, email } = user;
                    return (_jsx("div", { className: "flex justify-center", children: _jsx(CollaboratorWithHoverCard, { id: id, name: name, avatar: (id === 'aiRobot' ? (_jsx("div", { className: "flex size-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-amber-500", children: _jsx(MagicAi, { className: "size-4 text-amber-500" }) })) : (avatar)), email: email }) }));
                },
            },
            {
                accessorKey: 'field',
                header: t('noun.field'),
                size: 116,
                cell: ({ row }) => {
                    const after = row.getValue('after');
                    const { name: fieldName, type: fieldType } = after.meta;
                    const { Icon } = getFieldStatic(fieldType, {
                        isLookup: after.meta.isLookup,
                        isConditionalLookup: after.meta.isConditionalLookup,
                        hasAiConfig: false,
                    });
                    return (_jsxs("div", { className: "flex items-center gap-x-1", children: [_jsx(Icon, { className: "shrink-0" }), _jsx(OverflowTooltip, { text: fieldName, ellipsis: true, className: "flex-1 text-[13px]" })] }));
                },
            },
            {
                accessorKey: 'before',
                header: t('expandRecord.recordHistory.before'),
                size: actionVisible ? 220 : 280,
                cell: ({ row }) => {
                    const before = row.getValue('before');
                    const validatedCellValue = validateCellValue(before.meta, before.data);
                    const cellValue = validatedCellValue.success ? validatedCellValue.data : undefined;
                    const canCopy = SUPPORTED_COPY_FIELD_TYPES.includes(before.meta.type);
                    const copyText = typeof cellValue === 'string' ? cellValue : undefined;
                    return (_jsx("div", { className: cn('group relative', actionVisible ? 'w-52' : 'w-[264px]'), children: cellValue != null ? (_jsxs(Fragment, { children: [_jsx(CellValue, { value: cellValue, field: before.meta, className: actionVisible ? 'max-w-52' : 'max-w-[264px]' }), canCopy && copyText && (_jsx(CopyButton, { text: copyText, size: "xs", variant: "outline", className: "absolute right-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" }))] })) : (_jsx("span", { className: "text-gray-500", children: t('common.empty') })) }));
                },
            },
            {
                accessorKey: 'arrow',
                header: '',
                size: 40,
                cell: () => {
                    return (_jsx("div", { className: "flex w-full justify-center", children: _jsx(ArrowRight, { className: "text-gray-500" }) }));
                },
            },
            {
                accessorKey: 'after',
                header: t('expandRecord.recordHistory.after'),
                size: actionVisible ? 220 : 280,
                cell: ({ row }) => {
                    const after = row.getValue('after');
                    const validatedCellValue = validateCellValue(after.meta, after.data);
                    const cellValue = validatedCellValue.success ? validatedCellValue.data : undefined;
                    const canCopy = SUPPORTED_COPY_FIELD_TYPES.includes(after.meta.type);
                    const copyText = typeof cellValue === 'string' ? cellValue : undefined;
                    return (_jsx("div", { className: cn('group relative', actionVisible ? 'w-52' : 'w-[264px]'), children: cellValue != null ? (_jsxs(Fragment, { children: [_jsx(CellValue, { value: cellValue, field: after.meta, className: actionVisible ? 'max-w-52' : 'max-w-[264px]' }), canCopy && copyText && (_jsx(CopyButton, { text: copyText, size: "xs", variant: "outline", className: "absolute right-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" }))] })) : (_jsx("span", { className: "text-gray-500", children: t('common.empty') })) }));
                },
            },
        ];
        if (actionVisible) {
            tableColumns.push({
                accessorKey: 'recordId',
                header: t('common.actions'),
                size: 120,
                cell: ({ row }) => {
                    const recordId = row.getValue('recordId');
                    return (_jsxs(Button, { size: "xs", variant: "secondary", className: "h-6 gap-1 font-normal", onClick: () => onRecordClick(recordId), children: [t('expandRecord.recordHistory.viewRecord'), _jsx(ChevronRight, { className: "size-4" })] }));
                },
            });
        }
        return tableColumns;
    }, [recordId, userMap, t, getFieldStatic, onRecordClick]);
    const fetchNextPageInner = useCallback(() => {
        if (!isFetching && nextCursor) {
            fetchNextPage();
        }
    }, [fetchNextPage, isFetching, nextCursor]);
    if (!isHydrated || isLoading)
        return null;
    return (_jsx(InfiniteTable, { rows: allRows, columns: columns, className: "sm:overflow-x-hidden", fetchNextPage: fetchNextPageInner }));
};
