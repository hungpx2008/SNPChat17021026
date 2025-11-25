import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
import { useTables } from '../../hooks';
export const QueryFrom = (props) => {
    const tables = useTables();
    const { onClick } = props;
    const { t } = useTranslation();
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { className: "text-[13px]", variant: "outline", size: 'xs', children: [t('baseQuery.add'), _jsx(Plus, {})] }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsxs(DropdownMenuSub, { children: [_jsx(DropdownMenuSubTrigger, { children: t('baseQuery.from.fromTable') }), _jsx(DropdownMenuPortal, { children: _jsx(DropdownMenuSubContent, { children: tables.map((table) => (_jsx(DropdownMenuItem, { onClick: () => onClick?.('table', table.id), children: table.name }, table.id))) }) })] }), _jsx(DropdownMenuItem, { onClick: () => onClick?.('source'), children: t('baseQuery.from.fromQuery') })] })] }));
};
