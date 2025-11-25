import { jsx as _jsx } from "react/jsx-runtime";
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@teable/ui-lib';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { RecordItem } from './RecordItem';
import { RecordList } from './RecordList';
import { RecordSearch } from './RecordSearch';
export const ApiRecordList = (props) => {
    const { queryFn, queryKey, onSearch, selectedRecordIds, pageSize, onClick, onSelected } = props;
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const updateSearchParam = useMemo(() => {
        return debounce((search) => {
            return onSearch?.(search);
        }, 300);
    }, [onSearch]);
    useEffect(() => {
        if (!search) {
            return updateSearchParam(undefined);
        }
        updateSearchParam(search);
    }, [search, updateSearchParam]);
    const { status, data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey,
        queryFn,
        staleTime: 1000,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, allPage) => lastPage.length < pageSize ? undefined : allPage.length,
    });
    const allRows = data ? data.pages.flatMap((d) => d) : [];
    const rowCount = hasNextPage ? allRows.length + 1 : allRows.length;
    return (_jsx(RecordList, { className: "h-full", onSelect: (index) => {
            const record = allRows[index];
            if (!record) {
                return;
            }
            if (!selectedRecordIds?.includes(record.id)) {
                onSelected?.(record);
            }
            onClick?.(record);
        }, itemRender: (index) => {
            const record = allRows[index];
            if (rowCount - 1 <= index && hasNextPage) {
                return (_jsx(Button, { size: 'sm', variant: 'link', className: "mx-auto my-0.5", children: t('common.loadMore') }));
            }
            const isActive = selectedRecordIds?.includes(record.id);
            return _jsx(RecordItem, { title: record.title, active: isActive });
        }, rowCount: rowCount, isLoading: status === 'loading', onVisibleChange: (range) => {
            const [, endIndex] = range;
            if (rowCount - 1 <= endIndex && hasNextPage) {
                fetchNextPage();
            }
        }, children: onSearch && _jsx(RecordSearch, { value: search, onChange: (e) => setSearch(e.target.value) }) }));
};
