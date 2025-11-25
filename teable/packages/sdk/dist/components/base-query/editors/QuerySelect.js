import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, X } from '@teable/icons';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger, Error } from '@teable/ui-lib';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { ContextColumnsCommand } from '../common/ContextColumnCommand';
import { QueryEditorContext } from '../context/QueryEditorContext';
import { QueryFormContext } from '../context/QueryFormContext';
export const QuerySelect = (props) => {
    const { value, onChange } = props;
    const context = useContext(QueryEditorContext);
    const [error, setError] = useState();
    const { registerValidator } = useContext(QueryFormContext);
    const { t } = useTranslation();
    const columns = useMemo(() => context.columns.from.concat(context.columns.join), [context.columns.from, context.columns.join]);
    const validator = useCallback(() => {
        setError(undefined);
        if (!value) {
            return true;
        }
        const columnsIds = columns.map((c) => c.column);
        const excludeValue = value.filter((v) => !columnsIds.includes(v.column));
        if (excludeValue.length) {
            setError(t('baseQuery.error.invalidCols', {
                colNames: excludeValue.map((v) => v.alias).join(', '),
            }));
        }
        return excludeValue.length === 0;
    }, [value, columns, t]);
    useEffect(() => {
        registerValidator('select', validator);
        return () => {
            registerValidator('select', undefined);
        };
    }, [registerValidator, validator]);
    const onSelect = (selectColumn, { group, preSelected, }) => {
        const { column, name, type } = selectColumn;
        if (preSelected) {
            const newV = value?.filter((v) => v.column !== column);
            onChange?.(newV?.length ? newV : undefined);
        }
        else {
            onChange?.([
                ...(value ?? []),
                {
                    column,
                    alias: group ? `${group.name}_${name}` : name,
                    type,
                },
            ]);
        }
    };
    return (_jsxs("div", { className: "h-full", children: [_jsxs(Popover, { modal: true, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", className: "flex h-auto min-h-7 min-w-20 cursor-default py-0.5 text-[13px] font-normal hover:bg-inherit", size: 'xs', children: [_jsx("div", { className: "flex flex-1 flex-wrap justify-start gap-2", children: value?.map((v) => (_jsxs(Badge, { variant: 'secondary', children: [v.alias ?? columns?.find((c) => c.column === v.column)?.name, _jsx(Button, { variant: "link", className: "h-auto pr-0 text-[13px]", size: 'xs', onClick: (e) => {
                                                    e.stopPropagation();
                                                    const newV = value?.filter((item) => item.column !== v.column);
                                                    onChange?.(newV?.length ? newV : undefined);
                                                }, children: _jsx(X, {}) })] }, v.column))) || t('common.selectPlaceHolder') }), _jsx(ChevronDown, { className: "size-3 shrink-0 cursor-pointer" })] }) }), _jsx(PopoverContent, { align: "start", className: "w-full max-w-[200px] p-0", children: _jsx(ContextColumnsCommand, { isFilter: true, checked: value?.map((v) => v.column), onClick: onSelect }) })] }), _jsx(Error, { error: error })] }));
};
