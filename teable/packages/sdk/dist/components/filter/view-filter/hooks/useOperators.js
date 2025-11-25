import { getValidFilterOperators } from '@teable/core';
import { useMemo } from 'react';
export const useOperators = (field) => {
    return useMemo(() => {
        if (!field) {
            return [];
        }
        return getValidFilterOperators(field);
    }, [field]);
};
