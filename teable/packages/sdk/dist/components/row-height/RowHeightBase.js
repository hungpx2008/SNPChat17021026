import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
import { ReadOnlyTip } from '../ReadOnlyTip';
import { useFieldNameDisplayLinesNodes } from './useFieldNameDisplayLinesNodes';
import { useRowHeightNodes } from './useRowHeightNodes';
export const RowHeightBase = (props) => {
    const { rowHeight, fieldNameDisplayLines, children, onChange } = props;
    const { t } = useTranslation();
    const rowHeightMenuItems = useRowHeightNodes();
    const fieldNameDisplayLinesMenuItems = useFieldNameDisplayLinesNodes();
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: children }), _jsxs(DropdownMenuContent, { side: "bottom", align: "start", className: "relative w-52 p-0", children: [_jsx(ReadOnlyTip, {}), _jsx(DropdownMenuLabel, { className: "py-1 text-xs font-normal text-muted-foreground", children: t('rowHeight.title') }), _jsx(DropdownMenuSeparator, {}), rowHeightMenuItems.map(({ label, value: valueInner, Icon }) => (_jsxs(DropdownMenuCheckboxItem, { className: "cursor-pointer", checked: rowHeight === valueInner, onClick: () => onChange?.('rowHeight', valueInner), children: [_jsx(Icon, { className: "pr-1 text-lg" }), label] }, valueInner))), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuLabel, { className: "py-1 text-xs font-normal text-muted-foreground", children: t('fieldNameConfig.title') }), _jsx(DropdownMenuSeparator, {}), fieldNameDisplayLinesMenuItems.map(({ label, value: valueInner, Icon }) => (_jsxs(DropdownMenuCheckboxItem, { className: "cursor-pointer", checked: fieldNameDisplayLines === valueInner, onClick: () => onChange?.('fieldNameDisplayLines', valueInner), children: [_jsx(Icon, { className: "pr-1 text-lg" }), label] }, valueInner)))] })] }));
};
