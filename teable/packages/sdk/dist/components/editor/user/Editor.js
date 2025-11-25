import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import { useRef, useState } from 'react';
import { UserTag } from '../../cell-value';
import { UserEditorMain } from './EditorMain';
export const UserEditor = (props) => {
    const { value, options, onChange, className, style, readonly, ...reset } = props;
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);
    const { isMultiple } = options;
    const arrayValue = (isMultiple ? value : value ? [value] : null);
    const onDelete = (id) => {
        const newValue = arrayValue?.filter((v) => v.id !== id);
        onChange?.(isMultiple ? newValue : newValue?.[0]);
    };
    const onChangeInner = (val) => {
        onChange?.(val);
        if (!isMultiple) {
            setOpen(false);
        }
    };
    const triggerContent = (_jsx(Button, { style: style, variant: "outline", role: "combobox", "aria-expanded": open, className: cn('w-full h-auto min-h-9 sm:min-h-9 py-1 flex flex-wrap justify-start hover:bg-transparent gap-1.5', className), children: arrayValue?.map(({ id, title, avatarUrl }) => (_jsx(UserTag, { name: title, avatar: avatarUrl, suffix: _jsx(X, { className: "ml-[2px] cursor-pointer opacity-50 hover:opacity-100", onClick: (e) => {
                    e.preventDefault();
                    onDelete(id);
                } }) }, id))) }));
    return (_jsx(_Fragment, { children: readonly ? (triggerContent) : (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: true, children: [_jsx(PopoverTrigger, { ref: selectRef, asChild: true, children: triggerContent }), _jsx(PopoverContent, { className: "p-0", style: { width: selectRef.current?.offsetWidth || 0 }, children: _jsx(UserEditorMain, { ...reset, value: value, isMultiple: isMultiple, onChange: onChangeInner }) })] })) }));
};
