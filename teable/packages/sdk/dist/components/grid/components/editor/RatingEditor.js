import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { noop } from 'lodash';
import { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { isNumberKey } from '../../utils';
const RatingEditorBase = (props, ref) => {
    const { cell, onChange } = props;
    const focusRef = useRef(null);
    const [value, setValue] = useState(cell.data);
    const [lastTime, setLastTime] = useState(0);
    useImperativeHandle(ref, () => ({
        focus: () => focusRef.current?.focus(),
        setValue: (v) => setValue(v),
        saveValue: noop,
    }));
    const onKeyDown = (e) => {
        if (e.metaKey)
            return;
        if (isNumberKey(e.keyCode)) {
            const currentTime = Date.now();
            let newValue = Number(e.key);
            if (value === 1 && newValue === 0 && currentTime - lastTime <= 500) {
                newValue = Number(`${value}${newValue}`);
            }
            else {
                newValue =
                    newValue === value || newValue === 0 || Number.isNaN(newValue)
                        ? null
                        : Math.min(newValue, cell.max);
            }
            setValue(newValue);
            onChange?.(newValue);
            setLastTime(currentTime);
        }
    };
    return (_jsx("div", { onKeyDown: onKeyDown, className: "size-0", children: _jsx("input", { ref: focusRef, className: "size-0 border-none p-0 shadow-none outline-none" }) }));
};
export const RatingEditor = forwardRef(RatingEditorBase);
