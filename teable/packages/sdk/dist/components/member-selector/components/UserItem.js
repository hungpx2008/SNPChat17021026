import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox, cn } from '@teable/ui-lib';
import { UserAvatar } from '../../cell-value';
export const UserItem = ({ className, name, email, avatar, checked, showCheckbox = true, onCheckedChange, suffix, }) => {
    return (_jsxs("div", { className: cn('flex items-center gap-3 rounded-lg border p-3 py-2 hover:bg-accent', className), children: [showCheckbox && _jsx(Checkbox, { checked: checked, onCheckedChange: onCheckedChange }), _jsx(UserAvatar, { avatar: avatar, name: name }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "line-clamp-1 text-[13px] font-medium", children: name }), email && _jsx("div", { className: "line-clamp-1 text-[13px] text-muted-foreground", children: email })] }), suffix] }));
};
