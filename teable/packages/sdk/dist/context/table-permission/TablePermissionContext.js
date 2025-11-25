import { createContext } from 'react';
export const TablePermissionContextDefaultValue = {
    table: {},
    field: {},
    view: {},
    record: {},
};
export const TablePermissionContext = createContext(TablePermissionContextDefaultValue);
