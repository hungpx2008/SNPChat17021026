import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Button, Error } from '@teable/ui-lib';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { ContextColumnSelector } from '../common/ContextColumnSelector';
import { NewPopover } from '../common/NewPopover';
import { useAllColumns } from '../common/useAllColumns';
import { QueryFormContext } from '../context/QueryFormContext';
export const QueryGroup = (props) => {
    const { value, onChange } = props;
    const { registerValidator } = useContext(QueryFormContext);
    const [error, setError] = useState({});
    const columns = useAllColumns();
    const { t } = useTranslation();
    const validator = useCallback(() => {
        setError({});
        if (!value) {
            return true;
        }
        const columnsIds = columns.map((c) => c.column);
        const excludeValue = value.filter((v) => !columnsIds.includes(v.column));
        if (excludeValue.length) {
            setError(excludeValue.reduce((acc, v) => ({ ...acc, [v.column]: true }), {}));
        }
        return excludeValue.length === 0;
    }, [columns, value, setError]);
    useEffect(() => {
        registerValidator('groupBy', validator);
        return () => {
            registerValidator('groupBy', undefined);
        };
    }, [registerValidator, validator]);
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [value?.map((groupBy, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx(ContextColumnSelector, { value: groupBy.column, onChange: (column) => {
                                        const newGroupBy = [...value];
                                        newGroupBy[index] = {
                                            ...groupBy,
                                            column,
                                        };
                                        onChange(newGroupBy);
                                    } }) }), _jsx(Button, { className: "h-7 text-[13px]", variant: 'link', onClick: () => {
                                    const newValue = [...value];
                                    newValue.splice(index, 1);
                                    onChange(newValue);
                                }, children: _jsx(X, {}) })] }), _jsx(Error, { error: error[groupBy.column] ? t('baseQuery.error.invalidCol') : undefined })] }, index))), _jsx("div", { children: _jsx(NewQueryGroup, { onSubmit: (group) => {
                        onChange([...(value ?? []), group]);
                    } }) })] }));
};
const NewQueryGroup = (props) => {
    const { onSubmit } = props;
    const [column, setColumn] = useState();
    const [type, setType] = useState();
    const disabled = !column || !type;
    const onAdd = () => {
        if (disabled) {
            return;
        }
        onSubmit({
            column,
            type,
        });
        setColumn(undefined);
        setType(undefined);
    };
    return (_jsx(NewPopover, { addButton: {
            disabled,
        }, onSubmit: onAdd, children: _jsx(ContextColumnSelector, { value: column, onChange: (column, type) => {
                setColumn(column);
                setType(type);
            } }) }));
};
