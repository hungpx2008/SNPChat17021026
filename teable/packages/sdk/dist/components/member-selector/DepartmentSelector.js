import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useQuery } from '@tanstack/react-query';
import { getDepartmentList } from '@teable/openapi';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, cn, Dialog, DialogContent, DialogTrigger, ScrollArea, } from '@teable/ui-lib';
import { ChevronRight } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ReactQueryKeys } from '../../config';
import { useTranslation } from '../../context/app/i18n';
import { useOrganization } from '../../hooks';
import { DepartmentItem } from './components/DepartmentItem';
import { SearchInput } from './SearchInput';
const defaultCalcDisabled = {
    clickable: true,
    selectable: true,
};
export const DepartmentSelector = forwardRef((props, ref) => {
    const { onSelect, children, calcDisabled, title } = props;
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const [departmentId, setDepartmentId] = useState(undefined);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const { organization } = useOrganization();
    const [search, setSearch] = useState('');
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const { data: departments, isLoading } = useQuery({
        queryKey: ReactQueryKeys.getDepartmentList({ parentId: departmentId, search }),
        queryFn: ({ queryKey }) => getDepartmentList({
            ...queryKey[1],
        }).then((res) => res.data),
    });
    const reset = () => {
        setBreadcrumbs([]);
        setDepartmentId(undefined);
    };
    const handleBreadcrumbClick = async (index) => {
        if (index === -1) {
            reset();
        }
        else {
            const item = breadcrumbs[index];
            setBreadcrumbs((prev) => prev.slice(0, index + 1));
            setDepartmentId(item.id);
        }
    };
    const handleDepartmentClick = (item) => {
        setBreadcrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
        setDepartmentId(item.id);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: (open) => {
            if (!open) {
                reset();
            }
            setOpen(open);
        }, children: [_jsx(DialogTrigger, { asChild: true, children: children }), _jsx(DialogContent, { children: _jsxs("div", { className: "flex h-96 flex-col gap-4", children: [title, _jsx(SearchInput, { className: "w-full", search: search, placeholder: t('memberSelector.departmentSelectorSearchPlaceholder'), onSearch: setSearch }), _jsx(Breadcrumb, { className: "border-b bg-background px-4 pb-2", children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { onClick: () => handleBreadcrumbClick(-1), className: "cursor-pointer", children: organization?.name }) }), breadcrumbs.map((item, index) => (_jsxs(React.Fragment, { children: [_jsx(BreadcrumbSeparator, { children: _jsx(ChevronRight, { className: "size-4" }) }), _jsx(BreadcrumbItem, { children: index === breadcrumbs.length - 1 ? (_jsx(BreadcrumbPage, { children: item.name })) : (_jsx(BreadcrumbLink, { onClick: () => handleBreadcrumbClick(index), className: "cursor-pointer", children: item.name })) })] }, item.id)))] }) }), _jsx(ScrollArea, { className: "flex-1", children: _jsxs("div", { className: "space-y-2 px-4", children: [departments?.length === 0 && !isLoading && (_jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: t('memberSelector.emptyDepartment') })), _jsx(_Fragment, { children: departments?.map((item) => {
                                            const { clickable, selectable } = calcDisabled?.(item) ?? defaultCalcDisabled;
                                            return (_jsxs("div", { className: "relative", children: [_jsx(DepartmentItem, { className: cn({
                                                            'bg-accent pointer-events-none': !selectable,
                                                        }), name: item.name, checked: false, onClick: () => {
                                                            if (!selectable) {
                                                                return;
                                                            }
                                                            onSelect(item.id, item);
                                                            reset();
                                                            setOpen(false);
                                                        }, showCheckbox: false }), item.hasChildren && clickable && (_jsx("button", { className: "absolute right-0 top-0 z-10 flex h-full w-8 items-center justify-center rounded-r-lg border bg-background hover:bg-accent", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleDepartmentClick(item);
                                                        }, tabIndex: -1, children: _jsx(ChevronRight, { className: "size-4" }) }))] }, item.id));
                                        }) })] }) })] }) })] }));
});
DepartmentSelector.displayName = 'DepartmentSelector';
