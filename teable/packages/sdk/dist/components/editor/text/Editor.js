import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SingleLineTextDisplayType } from '@teable/core';
import { Link, Mail, Phone } from '@teable/icons';
import { Button, Input, cn } from '@teable/ui-lib';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { onMixedTextClick } from './utils';
const TextEditorBase = (props, ref) => {
    const { value, options, onChange, className, readonly, style, saveOnBlur = true } = props;
    const [text, setText] = useState(value || '');
    const inputRef = useRef(null);
    const showAs = options.showAs;
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        setValue: (value) => setText(value || ''),
        saveValue,
    }));
    const onChangeInner = (e) => {
        setText(e.target.value);
    };
    const saveValue = () => {
        onChange?.(text ? text.trim() : null);
    };
    const onJump = (type) => {
        onMixedTextClick(type, text);
    };
    const getIcon = (type) => {
        switch (type) {
            case SingleLineTextDisplayType.Url:
                return _jsx(Link, { className: "size-4" });
            case SingleLineTextDisplayType.Email:
                return _jsx(Mail, { className: "size-4" });
            case SingleLineTextDisplayType.Phone:
                return _jsx(Phone, { className: "size-4" });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "flex w-full items-center space-x-2", children: [_jsx(Input, { ref: inputRef, style: style, className: cn('h-10 sm:h-8', className), value: text, onChange: onChangeInner, onBlur: () => saveOnBlur && saveValue(), readOnly: readonly }), showAs && (_jsx(Button, { variant: "outline", size: "sm", className: "px-2", onClick: () => onJump(showAs.type), children: getIcon(showAs.type) }))] }));
};
export const TextEditor = forwardRef(TextEditorBase);
