import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCalendarDailyCollection, getShareViewCalendarDailyCollection } from '@teable/openapi';
import { throttle } from 'lodash';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ReactQueryKeys } from '../../config';
import { useSearch, useIsHydrated, useTableListener, useViewListener, useView } from '../../hooks';
import { useDocumentVisible } from '../../hooks/use-document-visible';
import { AnchorContext } from '../anchor';
import { ShareViewContext } from '../table/ShareViewContext';
import { CalendarDailyCollectionContext } from './CalendarDailyCollectionContext';
const THROTTLE_TIME = 2000;
export const CalendarDailyCollectionProvider = ({ children, query, }) => {
    const isHydrated = useIsHydrated();
    const { tableId, viewId } = useContext(AnchorContext);
    const queryClient = useQueryClient();
    const { searchQuery } = useSearch();
    const { shareId } = useContext(ShareViewContext);
    const view = useView();
    const visible = useDocumentVisible();
    const viewFilter = view?.filter;
    const { startDate, endDate, startDateFieldId, endDateFieldId } = query ?? {};
    const isEnabled = Boolean(startDate && endDate && startDateFieldId && endDateFieldId);
    const calenderDailyCollectionQuery = useMemo(() => {
        const { startDate, endDate, startDateFieldId, endDateFieldId, filter, ignoreViewQuery } = query ?? {};
        return {
            viewId,
            search: searchQuery,
            startDate: startDate || '',
            endDate: endDate || '',
            startDateFieldId: startDateFieldId || '',
            endDateFieldId: endDateFieldId || '',
            filter: shareId ? viewFilter : filter,
            ignoreViewQuery,
        };
    }, [query, viewId, searchQuery, shareId, viewFilter]);
    const queryKey = useMemo(() => ReactQueryKeys.calendarDailyCollection(shareId || tableId, calenderDailyCollectionQuery), [shareId, tableId, calenderDailyCollectionQuery]);
    const { data: commonCalendarDailyCollection } = useQuery({
        queryKey,
        queryFn: ({ queryKey }) => getCalendarDailyCollection(queryKey[1], queryKey[2]).then(({ data }) => data),
        enabled: Boolean(!shareId && tableId && isHydrated && isEnabled && visible),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
    const { data: shareCalendarDailyCollection } = useQuery({
        queryKey,
        queryFn: ({ queryKey }) => getShareViewCalendarDailyCollection(queryKey[1], queryKey[2]).then(({ data }) => data),
        enabled: Boolean(shareId && tableId && isHydrated && isEnabled && visible),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
    const resCalendarDailyCollection = shareId
        ? shareCalendarDailyCollection
        : commonCalendarDailyCollection;
    const updateCalendarDailyCollection = useCallback(() => queryClient.invalidateQueries({
        queryKey: queryKey.slice(0, 3),
    }), [queryClient, queryKey]);
    const throttleUpdateCalendarDailyCollection = useMemo(() => {
        return throttle(updateCalendarDailyCollection, THROTTLE_TIME);
    }, [updateCalendarDailyCollection]);
    const updateCalendarDailyCollectionForTable = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: queryKey.slice(0, 2),
        });
    }, [queryClient, queryKey]);
    const throttleUpdateCalendarDailyCollectionForTable = useMemo(() => {
        return throttle(updateCalendarDailyCollectionForTable, THROTTLE_TIME);
    }, [updateCalendarDailyCollectionForTable]);
    const tableMatches = useMemo(() => ['setRecord', 'addRecord', 'deleteRecord'], []);
    useTableListener(tableId, tableMatches, throttleUpdateCalendarDailyCollectionForTable);
    const viewMatches = useMemo(() => ['applyViewFilter'], []);
    useViewListener(viewId, viewMatches, throttleUpdateCalendarDailyCollection);
    const calendarDailyCollection = useMemo(() => resCalendarDailyCollection || null, [resCalendarDailyCollection]);
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey });
        };
    }, [queryClient, queryKey]);
    return (_jsx(CalendarDailyCollectionContext.Provider, { value: calendarDailyCollection, children: children }));
};
