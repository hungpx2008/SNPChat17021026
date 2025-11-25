import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import AutoSizeTextarea from 'react-textarea-autosize';
const LongTextEditorBase = (props, ref) => {
    const { value, onChange, className, readonly, saveOnBlur = true } = props;
    const [text, setText] = useState(value || '');
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        setValue: (value) => setText(value || ''),
        saveValue,
    }));
    const onChangeInner = (e) => {
        setText(e.target.value);
    };
    const saveValue = () => {
        onChange?.(text || null);
    };
    return (_jsx(AutoSizeTextarea, { ref: inputRef, className: cn('w-full resize-none rounded-md border border-input bg-background p-2 text-sm leading-6 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring', className), value: text, minRows: 2, maxRows: 10, readOnly: readonly, onBlur: () => saveOnBlur && saveValue(), onChange: onChangeInner }));
};
export const LongTextEditor = forwardRef(LongTextEditorBase);
