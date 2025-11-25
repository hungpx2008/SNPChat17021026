import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Button, ScrollArea } from '@teable/ui-lib';
import { useTranslation } from '../../context/app/i18n';
import { DepartmentItem } from './components/DepartmentItem';
import { UserItem } from './components/UserItem';
import { TreeNodeType } from './types';
export function MemberSelected({ selectedMembers, onRemove }) {
    const { t } = useTranslation();
    if (selectedMembers.length === 0) {
        return (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: t('memberSelector.empty') }));
    }
    return (_jsx(ScrollArea, { className: "h-full", children: _jsx("div", { className: "flex flex-col gap-2 p-4", children: selectedMembers.map(({ id, data }) => {
                const suffix = (_jsxs(Button, { variant: "ghost", size: "icon", className: "size-6 h-auto text-muted-foreground hover:text-foreground", onClick: () => onRemove(id), children: [_jsx(X, { className: "size-4" }), _jsxs("span", { className: "sr-only", children: [t('common.remove'), " ", data.name] })] }));
                return data.type === TreeNodeType.DEPARTMENT ? (_jsx(DepartmentItem, { name: data.name, checked: false, suffix: suffix, showCheckbox: false }, id)) : (_jsx(UserItem, { name: data.name, email: data.email, avatar: data.avatar, suffix: suffix, showCheckbox: false }, id));
            }) }) }));
}
