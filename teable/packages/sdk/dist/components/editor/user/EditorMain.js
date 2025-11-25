import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { FieldType } from '@teable/core';
import { getUserCollaborators } from '@teable/openapi';
import { forwardRef, useState } from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useBaseId } from '../../../hooks';
import { UserEditorBase } from './EditorBase';
const DefaultDataWrapper = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const baseId = useBaseId();
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ReactQueryKeys.baseCollaboratorListUser(baseId, {
            search: search,
        }),
        queryFn: ({ queryKey }) => getUserCollaborators(queryKey[1], queryKey[2]).then((res) => res.data),
    });
    const users = data?.users?.map((item) => ({
        userId: item.id,
        userName: item.name,
        email: item.email,
        avatar: item.avatar,
    }));
    const collaborators = props.includeMe
        ? [{ userId: 'me', userName: t('filter.currentUser'), email: '' }, ...(users || [])]
        : users;
    return (_jsx(UserEditorBase, { ...props, collaborators: collaborators, isLoading: isLoading, ref: ref, onSearch: setSearch }));
});
DefaultDataWrapper.displayName = 'UserDefaultDataWrapper';
const ContextDataWrapper = forwardRef((props, ref) => {
    const { isLoading, data, onSearch } = props.contextData;
    return (_jsx(UserEditorBase, { ...props, collaborators: data, isLoading: isLoading, ref: ref, onSearch: onSearch }));
});
ContextDataWrapper.displayName = 'UserContextDataWrapper';
const UserEditorMainBase = (props, ref) => {
    const contextData = props.context?.[FieldType.User];
    if (contextData) {
        return _jsx(ContextDataWrapper, { ...props, contextData: contextData, ref: ref });
    }
    return _jsx(DefaultDataWrapper, { ...props, ref: ref });
};
export const UserEditorMain = forwardRef(UserEditorMainBase);
