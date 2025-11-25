import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X } from '@teable/icons';
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import { keyBy } from 'lodash';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { SelectTag } from '../../cell-value/cell-select/SelectTag';
import { SelectEditorMain } from './EditorMain';
const SelectEditorBase = (props, ref) => {
    const { value, options = [], isMultiple, onChange, className, style, readonly } = props;
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);
    const editorRef = useRef(null);
    const optionsMap = useMemo(() => keyBy(options, 'value'), [options]);
    const arrayValue = isMultiple ? value : value ? [value] : [];
    const displayOptions = arrayValue?.map((value) => optionsMap[value]).filter(Boolean);
    useImperativeHandle(ref, () => ({
        focus: () => editorRef.current?.focus?.(),
        setValue: (value) => {
            editorRef.current?.setValue?.(value);
        },
    }));
    const onDelete = (val) => {
        const newValue = isMultiple ? value?.filter((v) => v !== val) : undefined;
        onChange?.(newValue);
    };
    const onChangeInner = (val) => {
        onChange?.(val);
        if (!isMultiple) {
            setOpen(false);
        }
    };
    const triggerContent = (_jsx(Button, { style: style, variant: "outline", role: "combobox", "aria-expanded": open, className: cn('w-full h-auto min-h-[32px] flex py-1 flex-wrap justify-start hover:bg-transparent gap-1.5 px-2', className), children: displayOptions?.map(({ value, label, backgroundColor, color }) => (_jsx(SelectTag, { className: "flex items-center", label: label, color: color, backgroundColor: backgroundColor, children: !readonly && (_jsx(X, { className: "cursor-pointer opacity-50 hover:opacity-100", onClick: (e) => {
                    e.preventDefault();
                    onDelete(value);
                } })) }, value))) }));
    return (_jsx(_Fragment, { children: readonly ? (triggerContent) : (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: true, children: [_jsx(PopoverTrigger, { ref: selectRef, asChild: true, children: triggerContent }), _jsx(PopoverContent, { className: "p-0", style: { width: selectRef.current?.offsetWidth || 0 }, children: _jsx(SelectEditorMain, { ref: editorRef, ...props, onChange: onChangeInner }) })] })) }));
};
export const SelectEditor = forwardRef(SelectEditorBase);
