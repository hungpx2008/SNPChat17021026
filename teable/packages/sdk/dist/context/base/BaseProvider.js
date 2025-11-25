import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { getBaseById, getBasePermission, LastVisitResourceType, updateUserLastVisit, } from '@teable/openapi';
import { useContext, useEffect, useMemo } from 'react';
import { ReactQueryKeys } from '../../config';
import { Base } from '../../model';
import { AnchorContext } from '../anchor';
import { BaseContext } from './BaseContext';
export const BaseProvider = ({ children, fallback }) => {
    const { baseId } = useContext(AnchorContext);
    const { data: baseData } = useQuery({
        queryKey: ReactQueryKeys.base(baseId),
        queryFn: ({ queryKey }) => queryKey[1] ? getBaseById(queryKey[1]).then((res) => res.data) : undefined,
    });
    useEffect(() => {
        if (baseData) {
            updateUserLastVisit({
                resourceId: baseData.id,
                resourceType: LastVisitResourceType.Base,
                parentResourceId: baseData.spaceId,
            });
        }
    }, [baseData]);
    const { data: basePermissionData } = useQuery({
        queryKey: ReactQueryKeys.getBasePermission(baseId),
        queryFn: ({ queryKey }) => queryKey[1] ? getBasePermission(queryKey[1]).then((res) => res.data) : undefined,
    });
    const value = useMemo(() => {
        const base = baseData;
        return {
            base: base ? new Base(base) : undefined,
            permission: basePermissionData,
        };
    }, [baseData, basePermissionData]);
    if (!value.base) {
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(BaseContext.Provider, { value: value, children: children });
};
