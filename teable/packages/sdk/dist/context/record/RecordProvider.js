import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { RecordContext } from './RecordContext';
export const RecordProvider = ({ children, serverRecords, serverRecord, }) => {
    const value = useMemo(() => {
        return { serverRecords, serverRecord };
    }, [serverRecords, serverRecord]);
    return _jsx(RecordContext.Provider, { value: value, children: children });
};
