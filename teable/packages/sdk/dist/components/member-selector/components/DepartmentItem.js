import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Building2 } from '@teable/icons';
import { Checkbox, cn } from '@teable/ui-lib';
export const DepartmentItem = ({ className, name, checked, suffix, onClick, onCheckedChange, showCheckbox = true, }) => {
    return (_jsxs("div", { className: cn('flex items-center gap-3 rounded-lg border p-3 hover:bg-accent', className), role: "button", onClick: onClick, children: [showCheckbox && (_jsx(Checkbox, { checked: checked, onCheckedChange: onCheckedChange, onClick: (e) => e.stopPropagation() })), _jsx(Building2, { className: "size-4" }), _jsx("div", { className: "min-w-0 flex-1", children: _jsx("div", { className: "line-clamp-1 text-[13px] font-medium", children: name }) }), suffix] }));
};
