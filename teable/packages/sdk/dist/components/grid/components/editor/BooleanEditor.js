import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { noop } from 'lodash';
import { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { Key as KeyCode } from 'ts-keycode-enum';
const BooleanEditorBase = (props, ref) => {
    const { cell, onChange } = props;
    const focusRef = useRef(null);
    const [value, setValue] = useState(cell.data);
    useImperativeHandle(ref, () => ({
        focus: () => focusRef.current?.focus(),
        setValue: (v) => setValue(v),
        saveValue: noop,
    }));
    const onKeyDown = (e) => {
        if (e.metaKey)
            return;
        if (e.keyCode === KeyCode.Enter) {
            const newValue = !value;
            setValue(newValue);
            onChange?.(newValue || null);
        }
    };
    return (_jsx("div", { onKeyDown: onKeyDown, className: "size-0", children: _jsx("input", { ref: focusRef, className: "size-0 border-none p-0 shadow-none outline-none" }) }));
};
export const BooleanEditor = forwardRef(BooleanEditorBase);
