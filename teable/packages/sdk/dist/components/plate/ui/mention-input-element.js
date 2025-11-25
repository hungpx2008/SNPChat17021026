'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { getUserCollaborators } from '@teable/openapi';
import { PlateElement } from '@udecode/plate/react';
import { getMentionOnSelectItem } from '@udecode/plate-mention';
import * as React from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useBaseId, useSession } from '../../../hooks';
import { UserAvatar } from '../../cell-value';
import { InlineCombobox, InlineComboboxContent, InlineComboboxEmpty, InlineComboboxGroup, InlineComboboxInput, InlineComboboxItem, } from './inline-combobox';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelectItem = getMentionOnSelectItem();
export function MentionInputElement(props) {
    const { editor, element } = props;
    const [search, setSearch] = React.useState('');
    const baseId = useBaseId();
    const { user } = useSession();
    const { t } = useTranslation();
    const { data: collaboratorsData } = useQuery({
        queryKey: ReactQueryKeys.baseCollaboratorListUser(baseId, {
            search,
            take: 100,
            skip: 0,
        }),
        queryFn: ({ queryKey }) => getUserCollaborators(queryKey[1], { search }).then((res) => res.data),
        enabled: !!baseId,
    });
    const mentionUsers = collaboratorsData?.users?.filter((item) => item.id !== user.id);
    return (_jsxs(PlateElement, { ...props, as: "span", "data-slate-value": element.value, children: [_jsxs(InlineCombobox, { value: search, element: element, setValue: setSearch, showTrigger: false, trigger: "@", children: [_jsx("span", { className: "inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2", children: _jsx(InlineComboboxInput, {}) }), _jsxs(InlineComboboxContent, { className: "my-1.5", children: [_jsx(InlineComboboxEmpty, { children: t('common.search.empty') }), _jsx(InlineComboboxGroup, { children: mentionUsers?.map((item) => (_jsxs(InlineComboboxItem, { onClick: () => {
                                        onSelectItem(editor, {
                                            key: item.id,
                                            // why do this, causing the mention select only write the text to node
                                            text: {
                                                id: item.id,
                                                name: item.name,
                                                avatar: item.avatar ?? undefined,
                                            },
                                        }, search);
                                    }, value: item.name, children: [_jsx(UserAvatar, { avatar: item.avatar, name: item.name }), _jsx("span", { className: "pl-1", children: item.name })] }, item.id))) })] })] }), props.children] }));
}
