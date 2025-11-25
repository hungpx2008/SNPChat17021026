import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Button } from '@teable/ui-lib';
import { useRef } from 'react';
import { useTranslation } from '../../../../context/app/i18n';
export const FileInput = (props) => {
    const { t } = useTranslation();
    const fileInput = useRef(null);
    const handleSelectFiles = (e) => {
        const fileList = e.target.files;
        fileList && props.onChange?.(Array.from(fileList));
        e.target.value = '';
    };
    return (_jsxs(Button, { variant: 'ghost', className: "m-1 gap-2 font-normal", onClick: () => fileInput.current?.click(), children: [_jsx("input", { type: "file", className: "hidden", multiple: true, ref: fileInput, onChange: handleSelectFiles }), _jsx(Plus, {}), " ", t('editor.attachment.upload')] }));
};
