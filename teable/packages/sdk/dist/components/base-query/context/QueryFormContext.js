import { noop } from 'lodash';
import { createContext } from 'react';
export const QueryFormContext = createContext({
    validators: {
        from: undefined,
        join: undefined,
        select: undefined,
        groupBy: undefined,
        orderBy: undefined,
        where: undefined,
        limit: undefined,
        offset: undefined,
        aggregation: undefined,
    },
    registerValidator: noop,
});
