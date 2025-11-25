import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, Dialog, DialogContent, FilePreviewDialog, FilePreviewProvider } from '@teable/ui-lib';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { AttachmentEditorMain } from '../../editor';
import { useAttachmentPreviewI18Map } from '../../hooks';
export const GridAttachmentEditor = forwardRef((props, ref) => {
    const { record, field, isEditing, setEditing } = props;
    const containerRef = useRef(null);
    const attachments = record.getCellValue(field.id);
    const imagePreviewDialogRef = useRef(null);
    const i18nMap = useAttachmentPreviewI18Map();
    const { t } = useTranslation();
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
    useImperativeHandle(ref, () => ({
        openFilePreview: (activeId) => {
            imagePreviewDialogRef.current?.openPreview?.(activeId);
        },
        closeFilePreview: () => {
            imagePreviewDialogRef.current?.closePreview?.();
        },
    }));
    const setAttachments = (attachments) => {
        record.updateCell(field.id, attachments, { t });
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: containerRef }), _jsx(Dialog, { open: isEditing, onOpenChange: setEditing, children: _jsx(DialogContent, { container: containerRef.current, className: cn('click-outside-ignore flex-1 overflow-hidden max-w-xl p-5 pt-8', Object.values(attachments || {}).length > 5 ? 'h-full max-h-[600px] mt-1 mb-1' : 'h-96'), onOpenAutoFocus: (e) => e.preventDefault(), children: _jsx(AttachmentEditorMain, { value: attachments || [], onChange: setAttachments }) }) }), _jsx(FilePreviewProvider, { i18nMap: i18nMap, children: _jsx(FilePreviewDialog, { ref: imagePreviewDialogRef, files: previewFiles }) })] }));
});
GridAttachmentEditor.displayName = 'GridAttachmentEditor';
