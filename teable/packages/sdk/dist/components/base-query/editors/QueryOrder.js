import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SortFunc } from '@teable/core';
import { X } from '@teable/icons';
import { Button, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Separator, Error, } from '@teable/ui-lib';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { ContextColumnSelector } from '../common/ContextColumnSelector';
import { NewPopover } from '../common/NewPopover';
import { useAllColumns } from '../common/useAllColumns';
import { QueryFormContext } from '../context/QueryFormContext';
export const QueryOrder = (props) => {
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
        registerValidator('orderBy', validator);
        return () => {
            registerValidator('orderBy', undefined);
        };
    }, [registerValidator, validator]);
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [value?.map((orderBy, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ContextColumnSelector, { isFilter: true, className: "flex-1", value: orderBy.column, onChange: (column) => {
                                            const newOrderBy = [...value];
                                            newOrderBy[index] = {
                                                ...orderBy,
                                                column,
                                            };
                                            onChange(newOrderBy);
                                        } }), _jsx(Separator, { className: "w-2" }), _jsx(SortFuncSelector, { value: orderBy.order, onChange: (order) => {
                                            const newOrderBy = [...value];
                                            newOrderBy[index] = {
                                                ...orderBy,
                                                order,
                                            };
                                            onChange(newOrderBy);
                                        } })] }), _jsx(Button, { className: "h-7", variant: 'link', onClick: () => {
                                    const newValue = [...value];
                                    newValue.splice(index, 1);
                                    onChange(newValue);
                                }, children: _jsx(X, {}) })] }), _jsx(Error, { error: error[orderBy.column] ? t('baseQuery.error.invalidCol') : undefined })] }, index))), _jsx("div", { children: _jsx(NewQueryOrder, { onSubmit: (order) => {
                        onChange([...(value ?? []), order]);
                    } }) })] }));
};
const NewQueryOrder = (props) => {
    const { onSubmit } = props;
    const [column, setColumn] = useState();
    const [type, setType] = useState();
    const [order, setOrder] = useState(SortFunc.Asc);
    const disabled = !column || !type;
    const onAdd = () => {
        if (disabled) {
            return;
        }
        onSubmit({
            column,
            type,
            order,
        });
        setColumn(undefined);
        setType(undefined);
    };
    return (_jsxs(NewPopover, { addButton: {
            disabled,
        }, onSubmit: onAdd, children: [_jsx(ContextColumnSelector, { className: "flex-1", value: column, isFilter: true, onChange: (column, type) => {
                    setColumn(column);
                    setType(type);
                } }), _jsx(Separator, { className: "w-2" }), _jsx(SortFuncSelector, { value: order, onChange: setOrder })] }));
};
const SortFuncSelector = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation();
    const options = useMemo(() => {
        return [
            { value: SortFunc.Asc, label: t('baseQuery.orderBy.asc') },
            { value: SortFunc.Desc, label: t('baseQuery.orderBy.desc') },
        ];
    }, [t]);
    return (_jsxs(Select, { value: value, onValueChange: onChange, children: [_jsx(SelectTrigger, { className: "h-7 flex-1 py-0 text-[13px]", children: _jsx(SelectValue, { placeholder: t('common.selectPlaceHolder') }) }), _jsx(SelectContent, { children: _jsx(SelectGroup, { children: options.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) }) })] }));
};
