import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from '@teable/icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Skeleton, cn, } from '@teable/ui-lib';
import { debounce } from 'lodash';
import { useCallback, useImperativeHandle, useRef, forwardRef, useState, useEffect, useMemo, } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { UserOption } from './UserOption';
const UserEditorBaseRef = (props, ref) => {
    const { value: cellValue, style, className, isLoading, isMultiple, collaborators, onChange, onSearch, initialSearch, } = props;
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const [search, setSearch] = useState(initialSearch ?? '');
    const [isComposing, setIsComposing] = useState(false);
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
    }));
    const onSelect = (value) => {
        if (isMultiple) {
            const innerValue = (cellValue || []);
            const newValue = innerValue.some((v) => v.id === value.id)
                ? innerValue.filter((v) => v.id !== value.id)
                : [...innerValue, value];
            onChange?.(newValue);
            return;
        }
        onChange?.(value.id === cellValue?.id ? undefined : value);
    };
    const activeStatus = useCallback((value) => {
        const originValue = isMultiple
            ? cellValue?.map((user) => user?.id)
            : [cellValue?.id];
        return originValue?.includes(value);
    }, [cellValue, isMultiple]);
    const setApplySearchDebounced = useMemo(() => {
        return onSearch ? debounce(onSearch, 200) : undefined;
    }, [onSearch]);
    useEffect(() => {
        if (!isComposing) {
            setApplySearchDebounced?.(search);
        }
    }, [search, isComposing, onSearch, setApplySearchDebounced]);
    return (_jsxs(Command, { className: className, style: style, shouldFilter: false, children: [_jsx(CommandInput, { ref: inputRef, value: search, placeholder: t('editor.user.searchPlaceholder'), onCompositionStart: () => setIsComposing(true), onCompositionEnd: () => setIsComposing(false), onValueChange: (value) => setSearch(value) }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: t('common.search.empty') }), _jsx(CommandGroup, { "aria-valuetext": "name", children: isLoading ? (_jsxs(CommandItem, { className: "flex items-center space-x-4", children: [_jsx(Skeleton, { className: "size-7 rounded-full" }), _jsx(Skeleton, { className: "h-4 w-32" })] })) : (collaborators?.map(({ userId, userName, avatar, email }) => (_jsxs(CommandItem, { value: userId, onSelect: () => onSelect({ id: userId, title: userName, avatarUrl: avatar, email }), className: "flex justify-between", children: [_jsx(UserOption, { name: userName, email: email, avatar: avatar }), _jsx(Check, { className: cn('ml-2 h-4 w-4', activeStatus(userId) ? 'opacity-100' : 'opacity-0') })] }, userId)))) })] })] }));
};
export const UserEditorBase = forwardRef(UserEditorBaseRef);
