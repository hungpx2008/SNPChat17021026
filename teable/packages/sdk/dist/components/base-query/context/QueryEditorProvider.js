import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { QueryEditorContext } from './QueryEditorContext';
export const QueryEditorProvider = (props) => {
    const { defaultStatus, children, columns, canSelectedColumnIds } = props;
    const [status, setStatus] = useState(defaultStatus ?? {
        select: false,
        aggregation: false,
        where: false,
        orderBy: false,
        groupBy: false,
        limit: false,
        offset: false,
        join: false,
    });
    return (_jsx(QueryEditorContext.Provider, { value: {
            status,
            setStatus: (type, value) => setStatus((prev) => ({ ...prev, [type]: value })),
            columns,
            canSelectedColumnIds,
        }, children: children }));
};
