import { jsx as _jsx } from "react/jsx-runtime";
import { FilePreviewDialog, FilePreviewProvider } from '@teable/ui-lib';
import { noop } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
export const GridFilePreviewer = (props) => {
    const { activeId, record, field, i18nMap } = props;
    const attachments = record.getCellValue(field.id);
    const imagePreviewDialogRef = useRef(null);
    useEffect(() => {
        imagePreviewDialogRef.current?.openPreview?.(activeId);
    }, [activeId]);
    const previewFiles = useMemo(() => {
        return attachments
            ? attachments.map((item) => ({
                src: item.presignedUrl || '',
                name: item.name,
                fileId: item.id,
                mimetype: item.mimetype,
            }))
            : [];
    }, [attachments]);
    return (_jsx(FilePreviewProvider, { i18nMap: i18nMap, children: _jsx(FilePreviewDialog, { ref: imagePreviewDialogRef, files: previewFiles }) }));
};
let closeModalFn = noop;
export const closePreviewModal = () => {
    closeModalFn();
    closeModalFn = noop;
};
export const expandPreviewModal = (props) => {
    closeModalFn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    const close = () => {
        root.unmount();
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    };
    closeModalFn = close;
    const render = (props) => {
        root.render(_jsx(GridFilePreviewer, { ...props }));
    };
    const update = (props) => {
        render(props);
        return {
            update,
        };
    };
    render(props);
    return {
        update,
    };
};
