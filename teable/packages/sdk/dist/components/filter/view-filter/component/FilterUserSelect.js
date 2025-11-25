import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { isMeTag, Me } from '@teable/core';
import { User as UserIcon } from '@teable/icons';
import { getUserCollaborators } from '@teable/openapi';
import { cn } from '@teable/ui-lib';
import { useCallback, useMemo, useState } from 'react';
import { ReactQueryKeys } from '../../../../config/react-query-keys';
import { useTranslation } from '../../../../context/app/i18n';
import { useBaseId } from '../../../../hooks/use-base-id';
import { useSession } from '../../../../hooks/use-session';
import { UserTag } from '../../../cell-value';
import { UserOption } from '../../../editor';
import { BaseMultipleSelect, BaseSingleSelect } from './base';
const SINGLE_SELECT_OPERATORS = ['is', 'isNot'];
const FilterUserSelectBase = (props) => {
    const { value, onSelect, operator, data, disableMe, onSearch, modal, className } = props;
    const { user: currentUser } = useSession();
    const { t } = useTranslation();
    const values = useMemo(() => value, [value]);
    const isMultiple = !SINGLE_SELECT_OPERATORS.includes(operator);
    const options = useMemo(() => {
        if (!data?.length)
            return [];
        const map = data.map(({ userId, userName, avatar }) => ({
            value: userId,
            label: userName,
            avatar: avatar,
        }));
        if (!disableMe && currentUser) {
            map.unshift({
                value: Me,
                label: t('filter.currentUser'),
                avatar: null,
            });
        }
        return map;
    }, [data, disableMe, currentUser, t]);
    const displayRender = useCallback((option) => {
        return (_jsx("div", { className: cn('gap-1 rounded-lg text-secondary-foreground', {
                'max-w-full overflow-hidden': !isMultiple,
            }), children: _jsx("div", { className: cn('flex items-center space-x-2 flex-1', {
                    truncate: !isMultiple,
                }), children: _jsx(UserTag, { avatar: isMeTag(option.value) ? (_jsx("span", { className: "flex shrink-0 items-center truncate rounded-full", children: _jsx(UserIcon, { className: "bg-secondary z-50 size-6 rounded-full border p-1" }) })) : (option.avatar), name: option.label, className: "flex-1 truncate" }) }) }, option.value));
    }, [isMultiple]);
    const optionRender = useCallback((option) => {
        return (_jsx("div", { className: "px text-secondary-foreground w-full truncate rounded-lg", children: _jsx(UserOption, { className: "w-full gap-2 truncate", avatar: isMeTag(option.value) ? (_jsx("span", { className: "bg-secondary flex size-full items-center justify-center", children: _jsx(UserIcon, { className: "size-4" }) })) : (option.avatar), name: option.label }) }, option.value));
    }, []);
    return (_jsx(_Fragment, { children: !isMultiple ? (_jsx(BaseSingleSelect, { options: options, modal: modal, onSelect: onSelect, value: values, displayRender: displayRender, optionRender: optionRender, className: cn('flex overflow-hidden', className ? className : 'w-64'), popoverClassName: "w-64", placeholderClassName: "text-xs", onSearch: onSearch })) : (_jsx(BaseMultipleSelect, { options: options, modal: modal, onSelect: onSelect, value: values, displayRender: displayRender, optionRender: optionRender, className: cn(className ? className : 'w-64'), popoverClassName: "w-64", placeholderClassName: "text-xs", onSearch: onSearch })) }));
};
const defaultData = {
    users: [],
};
const FilterUserSelect = (props) => {
    const baseId = useBaseId();
    const [search, setSearch] = useState('');
    const { data: collaboratorsData = defaultData } = useQuery({
        queryKey: ReactQueryKeys.baseCollaboratorListUser(baseId, {
            includeSystem: true,
            skip: 0,
            take: 100,
            search,
        }),
        queryFn: ({ queryKey }) => getUserCollaborators(queryKey[1], queryKey[2]).then((res) => res.data),
    });
    return (_jsx(FilterUserSelectBase, { ...props, data: collaboratorsData?.users?.map((item) => ({
            userId: item.id,
            userName: item.name,
            avatar: item.avatar,
        })), onSearch: setSearch }));
};
export { FilterUserSelect, FilterUserSelectBase };
