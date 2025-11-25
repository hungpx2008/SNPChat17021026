import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, cn, DialogFooter, DialogHeader, DialogTitle, Separator } from '@teable/ui-lib';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { DepartmentList } from './DepartmentList';
import { MemberSelected } from './MemberSelected';
import { SearchInput } from './SearchInput';
const _defaultSelectedMembers = [];
export const MemberContent = forwardRef(({ header, className, departmentId, defaultSelectedMembers, disabledDepartment, onCancel, onConfirm, onLoadData, }, ref) => {
    const [search, setSearch] = useState('');
    const [selectedMembers, setSelectedMembers] = useState(defaultSelectedMembers ?? _defaultSelectedMembers);
    const { t } = useTranslation();
    useEffect(() => {
        const data = onLoadData?.();
        if (data) {
            setSelectedMembers(data);
        }
    }, [onLoadData]);
    useImperativeHandle(ref, () => ({
        open: (selectedMembers) => {
            setSelectedMembers(selectedMembers ?? []);
        },
    }));
    const handleSelect = (member) => {
        setSelectedMembers((prev) => {
            const exists = prev.some((m) => m.id === member.id);
            if (exists) {
                return prev.filter((m) => m.id !== member.id);
            }
            return [
                ...prev,
                { id: member.id, type: member.type, data: member },
            ];
        });
    };
    const handleRemove = (id) => {
        setSelectedMembers((prev) => prev.filter((member) => member.id !== id));
    };
    return (_jsxs("div", { className: cn('flex flex-col gap-4', className), children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: header ?? t('memberSelector.title') }) }), _jsx("div", { className: "mb-2", children: _jsx(SearchInput, { search: search, onSearch: setSearch, placeholder: t('memberSelector.memberSelectorSearchPlaceholder') }) }), _jsxs("div", { className: "grid min-h-0 flex-1 grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex min-h-0 flex-col", children: [_jsx("div", { className: "h-8" }), _jsx("div", { className: "min-h-0 flex-1 overflow-hidden rounded-lg border", children: _jsx(DepartmentList, { departmentId: departmentId, selectedMembers: selectedMembers, onSelect: handleSelect, className: "h-full", search: search, disabledDepartment: disabledDepartment }) })] }), _jsxs("div", { className: "flex min-h-0 flex-col", children: [_jsxs("div", { className: "h-8 px-2 text-sm font-medium text-muted-foreground", children: [t('memberSelector.selected'), " (", selectedMembers.length, ")"] }), _jsx("div", { className: "min-h-0 flex-1 rounded-lg border", children: _jsx(MemberSelected, { selectedMembers: selectedMembers, onRemove: handleRemove }) })] })] }), _jsx(Separator, { className: "my-4" }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: onCancel, children: t('common.cancel') }), _jsx(Button, { onClick: () => onConfirm?.(selectedMembers), children: t('common.confirm') })] })] }));
});
MemberContent.displayName = 'MemberContent';
