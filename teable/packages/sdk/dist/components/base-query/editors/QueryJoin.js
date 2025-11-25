import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { X } from '@teable/icons';
import { BaseQueryJoinType, getFields } from '@teable/openapi';
import { Badge, Button, cn, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, Separator, Selector, } from '@teable/ui-lib';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useTables } from '../../../hooks';
import { NewPopover } from '../common/NewPopover';
import { QueryEditorContext } from '../context/QueryEditorContext';
export const QueryJoin = (props) => {
    const { value, onChange } = props;
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-4 overflow-y-hidden", children: [value?.map((join, index) => (_jsxs("div", { className: "flex items-center gap-2 overflow-auto", children: [_jsx(QueryJoinItem, { value: join, onChange: (newValue) => {
                            const newValueList = [...value];
                            newValueList[index] = newValue;
                            onChange(newValueList);
                        } }), _jsx(Button, { className: "text-[13px]", variant: 'link', onClick: () => {
                            const newValue = [...value];
                            newValue.splice(index, 1);
                            onChange(newValue);
                        }, children: _jsx(X, {}) })] }, index))), _jsx("div", { children: _jsx(NewQueryJoin, { onSubmit: (newJoin) => {
                        onChange([...(value ?? []), newJoin]);
                    } }) })] }));
};
const NewQueryJoin = (props) => {
    const { onSubmit } = props;
    const [type, setType] = useState(BaseQueryJoinType.Left);
    const [table, setTable] = useState();
    const [on, setOn] = useState();
    const disabled = !table || !on || !on[0] || !on[1] || !type;
    const onAdd = () => {
        if (disabled) {
            return;
        }
        onSubmit({
            type,
            table,
            on,
        });
        setType(BaseQueryJoinType.Left);
        setTable(undefined);
        setOn(undefined);
    };
    return (_jsx(NewPopover, { className: "w-auto max-w-[100vw]", addButton: {
            disabled,
        }, onSubmit: onAdd, children: _jsx("div", { className: "overflow-y-auto", children: _jsx(QueryJoinItem, { className: "min-w-[700px]", value: {
                    type,
                    table,
                    on,
                }, onChange: (value) => {
                    setType(value.type ?? BaseQueryJoinType.Left);
                    setTable(value.table);
                    setOn(value.on);
                } }) }) }));
};
const QueryJoinItem = (props) => {
    const { className, value = {}, onChange } = props;
    const context = useContext(QueryEditorContext);
    const columns = context.columns.from;
    const { t } = useTranslation();
    const { data: joinFields } = useQuery({
        queryKey: ['columns', value.table],
        queryFn: ({ queryKey }) => getFields(queryKey[1]).then((res) => res.data),
        enabled: !!value.table,
    });
    const tables = useTables();
    return (_jsxs("div", { className: cn('flex flex-1 items-center gap-4', className), children: [_jsxs("div", { className: "flex flex-1 items-center gap-4 rounded border bg-accent p-2", children: [_jsx(Button, { className: "flex-1 text-[13px]", size: 'xs', variant: 'outline', children: t('baseQuery.join.data') }), _jsx(JoinTypeSelector, { value: value.type, onChange: (type) => onChange({ ...value, type: type }) }), _jsx(Selector, { placeholder: t('common.selectPlaceHolder'), searchTip: t('common.search.placeholder'), className: "h-auto min-w-28 flex-1 gap-1 p-1 text-[13px]", candidates: tables.map((table) => ({ id: table.id, name: table.name, icon: table.icon })), selectedId: value.table, onChange: (tableId) => onChange({ ...value, table: tableId }) })] }), _jsx(Separator, { className: "w-3" }), _jsxs("div", { className: "flex min-h-11 flex-1 items-center gap-4 rounded border bg-accent p-2", children: [_jsx(Selector, { className: "h-auto min-w-12 flex-1 gap-1 p-1 text-[13px]", placeholder: t('common.selectPlaceHolder'), searchTip: t('common.search.placeholder'), candidates: columns?.map((column) => ({ id: column.column, name: column.name })), selectedId: value?.on?.[0], onChange: (columnId) => onChange({ ...value, on: [columnId, value?.on?.[1] ?? ''] }) }), _jsx(Badge, { className: "text-xs", children: "=" }), _jsx(Selector, { className: "h-auto min-w-12 flex-1 gap-1 p-1 text-[13px]", placeholder: t('common.selectPlaceHolder'), searchTip: t('common.search.placeholder'), candidates: joinFields?.map((field) => ({ id: field.id, name: field.name })), selectedId: value?.on?.[1], onChange: (columnId) => onChange({ ...value, on: [value?.on?.[0] ?? '', columnId] }) })] })] }));
};
const JoinTypeSelector = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation();
    const joinStatic = useMemo(() => [
        {
            id: BaseQueryJoinType.Left,
            name: t('baseQuery.join.leftJoin'),
        },
        {
            id: BaseQueryJoinType.Right,
            name: t('baseQuery.join.rightJoin'),
        },
        {
            id: BaseQueryJoinType.Inner,
            name: t('baseQuery.join.innerJoin'),
        },
        {
            id: BaseQueryJoinType.Full,
            name: t('baseQuery.join.fullJoin'),
        },
    ], [t]);
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { className: "flex items-center", children: _jsx(Badge, { className: "text-xs", children: joinStatic.find((join) => join.id === value)?.name }) }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsx(DropdownMenuLabel, { children: t('baseQuery.join.joinType') }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuRadioGroup, { value: value, onValueChange: (value) => onChange(value), children: joinStatic.map((join) => (_jsx(DropdownMenuRadioItem, { value: join.id, children: join.name }, join.id))) })] })] }));
};
