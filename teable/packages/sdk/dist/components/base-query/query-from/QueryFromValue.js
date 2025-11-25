import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Badge, Error } from '@teable/ui-lib';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useTables } from '../../../hooks';
import { QueryFormContext } from '../context/QueryFormContext';
export const QueryFromTableValue = ({ from, onChange, component, }) => {
    const tables = useTables();
    const [error, setError] = useState();
    const { registerValidator } = useContext(QueryFormContext);
    const { t } = useTranslation();
    const needValidator = !from || typeof from === 'string';
    useEffect(() => {
        if (from) {
            setError(undefined);
        }
    }, [from]);
    const validator = useCallback(() => {
        setError(undefined);
        if (!from) {
            setError(t('baseQuery.error.requiredSelect'));
            return false;
        }
        if (!tables.some((table) => table.id === from)) {
            setError(t('baseQuery.error.invalidTable'));
            return false;
        }
        return true;
    }, [from, tables, t]);
    useEffect(() => {
        if (needValidator) {
            registerValidator('from', validator);
        }
        return () => {
            registerValidator('from', undefined);
        };
    }, [registerValidator, validator, needValidator]);
    const clearFrom = () => {
        onChange(undefined);
    };
    return (_jsxs("div", { className: "flex-1", children: [component ||
                (from && (_jsxs(Badge, { variant: 'outline', className: "mt-0.5 h-6 gap-1", children: [tables.find((table) => table.id === from)?.name, _jsx(X, { className: "cursor-pointer", onClick: clearFrom })] }))), _jsx(Error, { error: error })] }));
};
