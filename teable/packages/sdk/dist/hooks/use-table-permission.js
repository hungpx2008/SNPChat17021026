import { useContext, useMemo } from 'react';
import { TablePermissionContext } from '../context/table-permission';
// check table, view, record exclude field
export const useTablePermission = () => {
    const { table, view, record, field } = useContext(TablePermissionContext);
    return useMemo(() => {
        return { ...table, ...view, ...record, ...field };
    }, [table, view, record, field]);
};
