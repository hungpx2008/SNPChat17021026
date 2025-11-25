import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from '@teable/ui-lib';
import { useTranslation } from '../../../context/app/i18n';
import { useTables } from '../../../hooks';
import { FormItem } from '../FormItem';
export const QueryFrom = (props) => {
    const tables = useTables();
    const { addButton, children, onClick, maxDepth } = props;
    const { t } = useTranslation();
    return (_jsx("div", { className: "mb-4 flex gap-5 text-sm", children: _jsx(FormItem, { label: t('baseQuery.from.title'), children: _jsxs("div", { className: "flex-1", children: [addButton && (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { className: "text-[13px]", variant: "outline", size: 'xs', children: [t('baseQuery.add'), _jsx(Plus, {})] }) }), _jsx(DropdownMenuContent, { className: "w-56", children: maxDepth ? (_jsx("div", { className: "max-h-80 overflow-y-auto", children: tables.map((table) => (_jsx(DropdownMenuItem, { onClick: () => onClick?.('table', table.id), children: table.name }, table.id))) })) : (_jsxs(_Fragment, { children: [_jsxs(DropdownMenuSub, { children: [_jsx(DropdownMenuSubTrigger, { children: t('baseQuery.from.fromTable') }), _jsx(DropdownMenuPortal, { children: _jsx(DropdownMenuSubContent, { className: "max-h-80 overflow-y-auto", children: tables.map((table) => (_jsx(DropdownMenuItem, { onClick: () => onClick?.('table', table.id), children: table.name }, table.id))) }) })] }), _jsx(DropdownMenuItem, { onClick: () => onClick?.('query'), children: t('baseQuery.from.fromQuery') })] })) })] })), children] }) }) }));
};
