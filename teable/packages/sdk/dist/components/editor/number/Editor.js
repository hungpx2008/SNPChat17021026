import { jsx as _jsx } from "react/jsx-runtime";
import { parseStringToNumber } from '@teable/core';
import { Input, cn } from '@teable/ui-lib';
import { isNumber } from 'lodash';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
export const NumberEditorBase = (props, ref) => {
    const { value, onChange, className, readonly, style, saveOnBlur = true, saveOnChange = false, placeholder, } = props;
    const inputRef = useRef(null);
    const [str, setStr] = useState(isNumber(value) ? value.toString() : '');
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        setValue,
        saveValue,
    }));
    const setValue = (value) => {
        setStr(typeof value === 'number' ? value.toString() : '');
    };
    const saveValue = () => {
        onChange?.(parseStringToNumber(str));
    };
    const onChangeHandler = (e) => {
        const newValue = e.target.value;
        setStr(newValue);
        saveOnChange && onChange?.(parseStringToNumber(newValue));
    };
    return (_jsx(Input, { ref: inputRef, style: style, className: cn('h-10 sm:h-8', className), value: str || '', onChange: onChangeHandler, onBlur: () => saveOnBlur && !saveOnChange && saveValue(), readOnly: readonly, placeholder: placeholder }));
};
export const NumberEditor = forwardRef(NumberEditorBase);
