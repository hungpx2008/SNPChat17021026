import { noop } from 'lodash';
import React from 'react';
export const QueryEditorContext = React.createContext({
    columns: {
        from: [],
        join: [],
    },
    status: {
        select: false,
        aggregation: false,
        where: false,
        orderBy: false,
        groupBy: false,
        limit: false,
        offset: false,
        join: false,
    },
    setStatus: noop,
});
