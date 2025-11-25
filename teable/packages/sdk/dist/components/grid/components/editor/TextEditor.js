import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Input } from '@teable/ui-lib';
import { useState, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import AutoSizeTextarea from 'react-textarea-autosize';
import { Key } from 'ts-keycode-enum';
import { GRID_DEFAULT } from '../../configs';
import { CellType } from '../../renderers';
const { rowHeight: defaultRowHeight } = GRID_DEFAULT;
const TextEditorBase = (props, ref) => {
    const { cell, rect, style, theme, isEditing, onChange } = props;
    const { cellLineColorActived } = theme;
    const { width, height } = rect;
    const { displayData, type } = cell;
    const needWrap = cell?.isWrap;
    const inputRef = useRef(null);
    const [value, setValueInner] = useState(displayData);
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        setValue: (value) => setValueInner(String(value ?? '')),
        saveValue,
    }));
    const saveValue = () => {
        if (value === displayData || !isEditing)
            return;
        if (type === CellType.Number) {
            onChange?.(Number(value));
        }
        else {
            onChange?.(typeof value === 'string' ? value.trim() : value);
        }
    };
    const onChangeInner = (e) => {
        const value = e.target.value;
        setValueInner(value);
    };
    const onKeyDown = (event) => {
        const { keyCode, shiftKey } = event;
        if (keyCode === Key.Enter && !shiftKey) {
            event.preventDefault();
        }
        if (keyCode === Key.Enter && shiftKey) {
            event.stopPropagation();
        }
    };
    const attachStyle = useMemo(() => {
        const style = {
            width: width + 4,
            minHeight: height + 4,
            height: needWrap ? 'auto' : height + 4,
            marginLeft: -2,
            marginTop: -2,
            textAlign: type === CellType.Number ? 'right' : 'left',
        };
        if (height > defaultRowHeight) {
            style.paddingBottom = height - defaultRowHeight;
        }
        return style;
    }, [type, height, width, needWrap]);
    return (_jsx(_Fragment, { children: needWrap ? (_jsxs("div", { style: {
                ...style,
                ...attachStyle,
                paddingBottom: 16,
                border: `2px solid ${cellLineColorActived}`,
            }, className: "relative rounded-md bg-background", children: [_jsx(AutoSizeTextarea, { ref: inputRef, className: "w-full resize-none rounded border-none bg-background px-2 pt-1 text-[13px] leading-[1.4rem] focus-visible:outline-none", value: value, minRows: 2, maxRows: 5, onBlur: saveValue, onKeyDown: onKeyDown, onChange: onChangeInner }), _jsx("div", { className: "absolute bottom-[2px] left-0 w-full rounded-b-md bg-background pb-[2px] pr-1 text-right text-xs text-slate-400 dark:text-slate-600", children: "Shift + Enter" })] })) : (_jsx(Input, { ref: inputRef, style: {
                border: `2px solid ${cellLineColorActived}`,
                ...style,
                ...attachStyle,
            }, value: value, className: "cursor-text border-2 px-2 text-[13px] shadow-none focus-visible:ring-transparent", onChange: onChangeInner, onBlur: saveValue, onMouseDown: (e) => e.stopPropagation() })) }));
};
export const TextEditor = forwardRef(TextEditorBase);
