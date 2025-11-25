import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { SearchContext } from './SearchContext';
export const SearchProvider = ({ children }) => {
    const [fieldId, setFieldId] = useState();
    const [value, setValue] = useState();
    const [hideNotMatchRow, setHideNotMatchRow] = useState(false);
    const reset = useCallback(() => {
        setFieldId(undefined);
        setValue(undefined);
    }, []);
    const searchQuery = useMemo(() => {
        if (value && fieldId) {
            if (fieldId === 'all_fields') {
                // url deal undefined will throw it, so use '' instead
                return [value, '', !!hideNotMatchRow];
            }
            return [value, fieldId, !!hideNotMatchRow];
        }
        return undefined;
    }, [fieldId, value, hideNotMatchRow]);
    return (_jsx(SearchContext.Provider, { value: {
            value,
            fieldId,
            searchQuery,
            setFieldId,
            setValue,
            reset,
            hideNotMatchRow,
            setHideNotMatchRow,
        }, children: children }));
};
