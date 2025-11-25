import { jsx as _jsx } from "react/jsx-runtime";
import { IdPrefix } from '@teable/core';
import { useContext, useMemo } from 'react';
import { createTableInstance } from '../../model';
import { AnchorContext } from '../anchor';
import { useInstances } from '../use-instances';
import { TableContext } from './TableContext';
export const TableProvider = ({ children, serverData }) => {
    const { baseId } = useContext(AnchorContext);
    const { instances: tables } = useInstances({
        collection: `${IdPrefix.Table}_${baseId}`,
        factory: createTableInstance,
        initData: serverData,
        queryParams: {},
    });
    const value = useMemo(() => {
        return { tables };
    }, [tables]);
    return _jsx(TableContext.Provider, { value: value, children: children });
};
