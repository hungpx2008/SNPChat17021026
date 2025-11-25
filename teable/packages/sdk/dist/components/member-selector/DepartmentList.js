import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChevronRight } from '@teable/icons';
import { getDepartmentList, getDepartmentUsers } from '@teable/openapi';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, ScrollArea, Skeleton, cn, Button, } from '@teable/ui-lib';
import * as React from 'react';
import { ReactQueryKeys } from '../../config';
import { useTranslation } from '../../context/app/i18n';
import { useOrganization } from '../../hooks';
import { DepartmentItem } from './components/DepartmentItem';
import { UserItem } from './components/UserItem';
import { TreeNodeType } from './types';
import { useDebounce } from './use-debounce';
const MEMBERS_PER_PAGE = 100;
export function DepartmentList({ departmentId, selectedMembers = [], onSelect, className, search, excludeType, disabledDepartment, }) {
    const { t } = useTranslation();
    const [currentDepartment, setCurrentDepartment] = React.useState(departmentId);
    const { organization } = useOrganization();
    const [breadcrumbs, setBreadcrumbs] = React.useState([]);
    const debouncedSearch = useDebounce(search, 300);
    const { data: departments, isLoading: isLoadingDepartments } = useQuery({
        queryKey: ReactQueryKeys.getDepartmentList({
            parentId: currentDepartment,
            search: debouncedSearch,
        }),
        staleTime: 1000,
        queryFn: ({ queryKey: [_, ro] }) => getDepartmentList({
            ...ro,
            parentId: search ? undefined : currentDepartment,
            includeChildrenDepartment: search ? true : ro?.includeChildrenDepartment,
        }).then((res) => res.data),
        enabled: !excludeType?.includes(TreeNodeType.DEPARTMENT),
    });
    const { data: members, isLoading: isLoadingMembers, fetchNextPage, hasNextPage, } = useInfiniteQuery({
        queryKey: ReactQueryKeys.getDepartmentUsers({
            departmentId: currentDepartment,
            search: debouncedSearch,
        }),
        queryFn: ({ pageParam = 0, queryKey: [_, ro] }) => getDepartmentUsers({
            ...ro,
            departmentId: ro?.search ? undefined : ro?.departmentId,
            includeChildrenDepartment: ro?.search ? true : ro?.includeChildrenDepartment,
            skip: pageParam * MEMBERS_PER_PAGE,
            take: MEMBERS_PER_PAGE,
        }).then((res) => res.data),
        staleTime: 1000,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            const allUsers = pages.flatMap((page) => page.users);
            return allUsers.length >= lastPage.total ? undefined : pages.length;
        },
        enabled: !excludeType?.includes(TreeNodeType.USER),
    });
    const isLoading = isLoadingDepartments || isLoadingMembers;
    const memberNodes = React.useMemo(() => {
        return (members?.pages
            .flatMap((page) => page.users)
            .map((member) => ({
            ...member,
            type: TreeNodeType.USER,
        })) ?? []);
    }, [members]);
    const departmentNodes = React.useMemo(() => {
        return (departments?.map((dept) => ({
            ...dept,
            type: TreeNodeType.DEPARTMENT,
        })) ?? []);
    }, [departments]);
    const handleBreadcrumbClick = async (index) => {
        if (index === -1) {
            setCurrentDepartment(undefined);
            setBreadcrumbs([]);
        }
        else {
            const item = breadcrumbs[index];
            setBreadcrumbs((prev) => prev.slice(0, index + 1));
            setCurrentDepartment(item.id);
        }
    };
    const isSelected = (id) => {
        return selectedMembers.some((member) => member.id === id);
    };
    const handleDepartmentClick = (item) => {
        setBreadcrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
        setCurrentDepartment(item.id);
    };
    return (_jsxs("div", { className: cn('flex flex-col h-full', className), children: [_jsx(Breadcrumb, { className: cn('bg-background px-4 py-2', {
                    'opacity-0': debouncedSearch,
                }), children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { onClick: () => handleBreadcrumbClick(-1), className: "cursor-pointer", children: organization?.name }) }), breadcrumbs.map((item, index) => (_jsxs(React.Fragment, { children: [_jsx(BreadcrumbSeparator, { children: _jsx(ChevronRight, { className: "size-4" }) }), _jsx(BreadcrumbItem, { children: index === breadcrumbs.length - 1 ? (_jsx(BreadcrumbPage, { children: item.name })) : (_jsx(BreadcrumbLink, { onClick: () => handleBreadcrumbClick(index), className: "cursor-pointer", children: item.name })) })] }, item.id)))] }) }), _jsx(ScrollArea, { className: "flex-1 border-t", children: _jsx("div", { className: "space-y-2 p-4", children: isLoading ? (_jsx("div", { className: "space-y-2", children: Array.from({ length: 5 }).map((_, i) => (_jsx(Skeleton, { className: "h-[52px]" }, i))) })) : memberNodes.length === 0 && departmentNodes.length === 0 ? (_jsx("div", { className: "py-4 text-center text-sm text-muted-foreground", children: t('memberSelector.empty') })) : (_jsxs(_Fragment, { children: [departmentNodes.map((item) => (_jsx(DepartmentItem, { name: item.name, checked: isSelected(item.id), onClick: () => handleDepartmentClick(item), onCheckedChange: () => onSelect(item), showCheckbox: !disabledDepartment, suffix: _jsx(ChevronRight, { className: "size-4 text-muted-foreground" }) }, item.id))), memberNodes.map((item) => (_jsx(UserItem, { name: item.name, email: item.email, avatar: item.avatar, checked: isSelected(item.id), onCheckedChange: () => onSelect(item) }, item.id))), hasNextPage && (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Button, { onClick: () => fetchNextPage(), children: t('common.loadMore') }) }))] })) }) })] }));
}
