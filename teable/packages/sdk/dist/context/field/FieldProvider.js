import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { IdPrefix } from '@teable/core';
import { useContext, useMemo } from 'react';
import { createFieldInstance } from '../../model';
import { AnchorContext } from '../anchor/AnchorContext';
import { useInstances } from '../use-instances';
import { FieldContext } from './FieldContext';
export const FieldProvider = ({ children, fallback, serverSideData }) => {
    const { viewId, tableId } = useContext(AnchorContext);
    const { instances: fields } = useInstances({
        collection: `${IdPrefix.Field}_${tableId}`,
        factory: createFieldInstance,
        initData: serverSideData,
        queryParams: { viewId },
    });
    const value = useMemo(() => {
        return { fields };
    }, [fields]);
    if (fallback && !fields.length) {
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(FieldContext.Provider, { value: value, children: children });
};
