import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { defaultDatetimeFormatting, formatDateToString } from '@teable/core';
import { Calendar as CalendarIcon } from '@teable/icons';
import { Button, Input, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import dayjs from 'dayjs';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useIsTouchDevice } from '../../../hooks';
import { DateEditorMain } from './EditorMain';
import { convertZonedInputToUtc, formatDisplayValue } from './utils';
const DateEditorBase = (props, ref) => {
    const { value, onChange, className, readonly, options, disableTimePicker = false } = props;
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const popoverTriggerRef = useRef(null);
    const popoverContentRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [originalInputValue, setOriginalInputValue] = useState('');
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const isTouchDevice = useIsTouchDevice();
    const { t } = useTranslation();
    const formatting = options?.formatting || defaultDatetimeFormatting;
    useImperativeHandle(ref, () => ({
        setValue: (value) => {
            editorRef.current?.setValue?.(value);
        },
    }));
    useEffect(() => {
        setInputValue(formatDisplayValue(value || '', formatting));
    }, [value, formatting]);
    const onInputBlur = (e) => {
        const relatedTarget = e.relatedTarget;
        if (inputValue === originalInputValue)
            return;
        if (relatedTarget && popoverContentRef.current?.contains(relatedTarget))
            return;
        const value = convertZonedInputToUtc(inputValue, formatting);
        onChange?.(value);
        setEditing(false);
    };
    const onInputClick = () => {
        setPopoverOpen(true);
        setEditing(true);
        setOriginalInputValue(inputValue);
        inputRef.current?.focus();
    };
    const onCalendarChange = (value) => {
        onChange?.(value);
        setEditing(false);
    };
    let displayStr = value || '';
    displayStr = dayjs(displayStr).isValid() ? formatDateToString(displayStr || '', formatting) : '';
    const placeholder = !readonly ? t('editor.date.placeholder') : '';
    return (_jsxs(Popover, { open: isPopoverOpen, onOpenChange: setPopoverOpen, children: [isTouchDevice ? (_jsx(PopoverTrigger, { asChild: true, disabled: readonly, children: _jsxs(Button, { variant: 'outline', className: cn('w-full first-line:pl-3 text-left font-normal h-10 sm:h-9', !value && 'text-muted-foreground', className), children: [displayStr || t('editor.date.placeholder'), _jsx(CalendarIcon, {})] }) })) : (_jsx(PopoverTrigger, { ref: popoverTriggerRef, disabled: readonly, asChild: true, children: _jsxs("div", { className: "relative", children: [_jsx(Input, { ref: inputRef, value: inputValue, readOnly: readonly, placeholder: placeholder, className: cn('w-full h-10 sm:h-8', className), onChange: (e) => setInputValue(e.target.value), onClick: onInputClick, onBlur: onInputBlur }), !isEditing && (_jsx(Input, { className: cn('absolute left-0 top-0 w-full h-10 sm:h-8 shadow-none pointer-events-none disabled:opacity-100', className), placeholder: placeholder, value: displayStr, readOnly: true }))] }) })), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", ref: popoverContentRef, onOpenAutoFocus: (e) => e.preventDefault(), children: _jsx(DateEditorMain, { ref: editorRef, value: value, options: options, disableTimePicker: disableTimePicker, onChange: onCalendarChange }) })] }));
};
export const DateEditor = forwardRef(DateEditorBase);
