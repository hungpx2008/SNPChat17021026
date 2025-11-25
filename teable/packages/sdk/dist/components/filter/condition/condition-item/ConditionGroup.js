import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, Trash2 } from '@teable/icons';
import { Button, DropdownMenu, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@teable/ui-lib';
import { useTranslation } from '../../../../context/app/i18n';
import { useCrud, useDepth } from '../../hooks';
export const ConditionGroup = (props) => {
    const { children, path, index, depth } = props;
    const maxDepth = useDepth();
    const { onDelete, createCondition } = useCrud();
    const { t } = useTranslation();
    return (_jsxs("div", { className: "flex flex-1 flex-col rounded-sm border border-input px-2 py-1", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "flex-1 truncate text-xs", children: t('filter.groupDescription') }), _jsxs("div", { className: "flex gap-1", children: [_jsxs(DropdownMenu, { modal: false, children: [_jsx(DropdownMenuTrigger, { children: _jsx(Button, { size: "xs", variant: "ghost", className: "size-7", children: _jsx(Plus, {}) }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { onClick: () => {
                                                    createCondition([...path, 'children'], 'item');
                                                }, children: t('filter.addCondition') }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("div", { children: _jsx(DropdownMenuItem, { disabled: depth + 1 > maxDepth, onClick: () => {
                                                                        createCondition([...path, 'children'], 'group');
                                                                    }, children: t('filter.addConditionGroup') }) }) }), depth + 1 > maxDepth && (_jsx(TooltipContent, { hideWhenDetached: true, children: _jsx("span", { children: t('filter.nestedLimitTip', { depth: maxDepth + 1 }) }) }))] }) })] })] }), _jsx(Button, { size: "xs", variant: "ghost", onClick: () => {
                                    onDelete(path, index);
                                }, children: _jsx(Trash2, {}) })] })] }), _jsx("div", { className: "flex flex-col", children: children })] }));
};
export const ConditionGroupContent = ({ children }) => {
    return children;
};
ConditionGroupContent.displayName = 'ConditionGroupContent';
