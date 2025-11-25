import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { QueryFormContext } from './QueryFormContext';
export const QueryFormProvider = (props) => {
    const [validators, setValidators] = useState({
        join: undefined,
        select: undefined,
        groupBy: undefined,
        orderBy: undefined,
        where: undefined,
        limit: undefined,
        offset: undefined,
        aggregation: undefined,
        from: undefined,
    });
    const registerValidator = useCallback((key, fn) => {
        setValidators((prev) => ({ ...prev, [key]: fn }));
    }, []);
    return (_jsx(QueryFormContext.Provider, { value: { validators, registerValidator }, children: props.children }));
};
