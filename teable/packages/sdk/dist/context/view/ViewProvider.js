import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { IdPrefix } from '@teable/core';
import { useContext, useMemo } from 'react';
import { createViewInstance } from '../../model/view/factory';
import { AnchorContext } from '../anchor';
import { useInstances } from '../use-instances';
import { ViewContext } from './ViewContext';
export const ViewProvider = ({ children, fallback, serverData }) => {
    const { tableId } = useContext(AnchorContext);
    const { instances: views } = useInstances({
        collection: `${IdPrefix.View}_${tableId}`,
        factory: createViewInstance,
        initData: serverData,
        queryParams: {},
    });
    const value = useMemo(() => {
        return { views };
    }, [views]);
    if (fallback && !views.length) {
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(ViewContext.Provider, { value: value, children: children });
};
