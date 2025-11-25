import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskStatusCollection } from '@teable/openapi';
import { useCallback, useContext, useMemo } from 'react';
import { ReactQueryKeys } from '../../config';
import { useIsHydrated, useTableListener } from '../../hooks';
import { AnchorContext } from '../anchor';
import { TaskStatusCollectionContext } from './TaskStatusCollectionContext';
export const TaskStatusCollectionProvider = ({ children, }) => {
    const isHydrated = useIsHydrated();
    const { tableId } = useContext(AnchorContext);
    const queryClient = useQueryClient();
    const { data: resTaskStatusCollection } = useQuery({
        queryKey: ReactQueryKeys.getTaskStatusCollection(tableId),
        queryFn: ({ queryKey }) => getTaskStatusCollection(queryKey[1]).then((data) => data.data),
        enabled: Boolean(tableId && isHydrated),
        refetchOnWindowFocus: false,
        retry: 1,
    });
    const updateTaskStatusCollectionForTable = useCallback(() => {
        queryClient.invalidateQueries(ReactQueryKeys.getTaskStatusCollection(tableId));
    }, [queryClient, tableId]);
    const tableMatches = useMemo(() => ['taskProcessing', 'taskCompleted', 'taskCancelled'], []);
    useTableListener(tableId, tableMatches, updateTaskStatusCollectionForTable);
    const taskStatusCollection = useMemo(() => resTaskStatusCollection || null, [resTaskStatusCollection]);
    return (_jsx(TaskStatusCollectionContext.Provider, { value: taskStatusCollection, children: children }));
};
