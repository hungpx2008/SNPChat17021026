import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn } from '@teable/ui-lib';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDrop, useDropArea } from 'react-use';
import { useTranslation } from '../context/app/i18n';
const defaultZone = ['drop', 'click'];
export const FileZone = (props) => {
    const { t } = useTranslation();
    const { className, fileInputProps, onChange, disabled, children, action = defaultZone, defaultText = 'File upload', } = props;
    const actions = useMemo(() => (Array.isArray(action) ? action : [action]), [action]);
    const { over: hasOver } = useDrop();
    const [bound, { over }] = useDropArea({
        onFiles: (files, event) => {
            if (actions.includes('drop') && event.type === 'drop')
                onChange?.(files);
            if (actions.includes('paste') && event.type === 'paste')
                onChange?.(files);
        },
    });
    const [dragFileEnter, setDragFileEnter] = useState(false);
    const fileInput = useRef(null);
    const updateDragFileEnter = useMemo(() => {
        return debounce(setDragFileEnter, 30);
    }, []);
    useEffect(() => {
        updateDragFileEnter(hasOver);
    }, [updateDragFileEnter, hasOver]);
    if (!dragFileEnter && children) {
        return (_jsx("div", { className: cn('min-h-full cursor-default p-[1px]', className), tabIndex: 0, role: "button", ...bound, children: children }));
    }
    return (_jsx("div", { className: cn('flex size-full min-h-[100px] flex-col', className), children: _jsxs("div", { tabIndex: 0, role: "button", className: cn('flex-1 w-full bg-foreground/5 text-foreground/60 rounded-md flex items-center justify-center text-center border border-dashed cursor-default hover:border-foreground focus:border-foreground', over && 'border-foreground', disabled && 'opacity-50 cursor-not-allowed'), ...bound, onClick: () => fileInput.current?.click(), children: [over ? t('editor.attachment.uploadDragOver') : defaultText, actions.includes('click') && (_jsx("input", { multiple: true, ...fileInputProps, ref: fileInput, type: "file", className: "hidden", onChange: (e) => onChange?.(Array.from(e.target.files || [])) }))] }) }));
};
