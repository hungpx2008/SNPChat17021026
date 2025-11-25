import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { getShareView } from '@teable/openapi';
import { map } from 'lodash';
import { useMemo } from 'react';
import { ReactQueryKeys } from '../../config/react-query-keys';
import { useFields } from '../../hooks';
import { addQueryParamsToWebSocketUrl } from '../../utils/urlParams';
import { AnchorContext } from '../anchor/AnchorContext';
import { ConnectionProvider } from '../app';
import { getWsPath } from '../app/useConnection';
import { FieldProvider } from '../field';
import { SearchProvider } from '../query';
import { RecordProvider } from '../record';
import { TablePermissionContext, TablePermissionContextDefaultValue } from '../table-permission';
import { ShareViewContext } from './ShareViewContext';
const ReadonlyFieldsPermissionProvider = ({ children }) => {
    const fields = useFields({ withHidden: true, withDenied: true });
    const fieldIds = map(fields, 'id');
    const value = useMemo(() => {
        return {
            ...TablePermissionContextDefaultValue,
            fields: {
                'field|read': true,
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(fieldIds)]);
    return (_jsx(TablePermissionContext.Provider, { value: value, children: children }));
};
export const LinkViewProvider = ({ linkFieldId, linkBaseId, children, fallback, }) => {
    const { data: shareData, isLoading } = useQuery({
        queryKey: ReactQueryKeys.shareView(linkFieldId),
        enabled: Boolean(linkFieldId),
        queryFn: () => getShareView(linkFieldId).then(({ data }) => data),
    });
    const wsPath = useMemo(() => {
        if (typeof window === 'object') {
            return addQueryParamsToWebSocketUrl(getWsPath(), { shareId: linkFieldId });
        }
        return undefined;
    }, [linkFieldId]);
    if (isLoading || !linkFieldId || !shareData) {
        return fallback;
    }
    const { tableId, viewId, fields } = shareData;
    return (_jsx(ConnectionProvider, { wsPath: wsPath, children: _jsx(ShareViewContext.Provider, { value: shareData, children: _jsx(AnchorContext.Provider, { value: { baseId: linkBaseId, tableId, viewId }, children: _jsx(SearchProvider, { children: _jsx(FieldProvider, { fallback: fallback, serverSideData: fields, children: _jsx(ReadonlyFieldsPermissionProvider, { children: _jsx(RecordProvider, { children: children }) }) }) }) }) }) }));
};
