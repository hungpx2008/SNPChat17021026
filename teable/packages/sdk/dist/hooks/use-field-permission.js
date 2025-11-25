import { useContext } from 'react';
import { TablePermissionContext } from '../context/table-permission';
export const useFieldPermission = () => {
    const { field } = useContext(TablePermissionContext) ?? {};
    return field;
};
