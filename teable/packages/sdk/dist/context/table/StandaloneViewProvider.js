import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { RowCountContext, RowCountProvider } from '../aggregation';
import { AnchorContext } from '../anchor/AnchorContext';
import { FieldContext, FieldProvider } from '../field';
import { SearchProvider } from '../query';
import { RecordContext, RecordProvider } from '../record';
import { TablePermissionProvider } from '../table-permission';
import { ViewContext, ViewProvider } from '../view';
export const StandaloneViewProvider = ({ children, viewId, tableId, baseId, fallback, }) => {
    const value = useMemo(() => {
        return { viewId, tableId, baseId };
    }, [viewId, tableId, baseId]);
    return (_jsx(AnchorContext.Provider, { value: value, children: tableId ? (_jsx(TablePermissionProvider, { baseId: baseId, children: _jsx(SearchProvider, { children: _jsx(FieldProvider, { fallback: fallback, children: _jsx(ViewProvider, { children: _jsx(RecordProvider, { children: _jsx(RowCountProvider, { children: children }) }) }) }) }) })) : (_jsx(FieldContext.Provider, { value: { fields: [] }, children: _jsx(ViewContext.Provider, { value: { views: [] }, children: _jsx(RecordContext.Provider, { value: {}, children: _jsx(RowCountContext.Provider, { value: null, children: children }) }) }) })) }));
};
