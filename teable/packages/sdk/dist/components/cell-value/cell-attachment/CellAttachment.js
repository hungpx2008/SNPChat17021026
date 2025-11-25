import { jsx as _jsx } from "react/jsx-runtime";
import { FilePreviewItem, FilePreviewProvider, cn } from '@teable/ui-lib';
import { getFileCover, isSystemFileIcon } from '../../editor/attachment';
import { useAttachmentPreviewI18Map } from '../../hooks';
export const CellAttachment = (props) => {
    const { value, className, style, itemClassName } = props;
    const i18nMap = useAttachmentPreviewI18Map();
    return (_jsx(FilePreviewProvider, { i18nMap: i18nMap, children: _jsx("div", { className: cn('flex gap-1 flex-wrap', className), style: style, children: value?.map((attachment) => {
                const { id, name, mimetype, size, presignedUrl, lgThumbnailUrl } = attachment;
                return (_jsx(FilePreviewItem, { className: cn('shrink-0 size-7 border rounded border-slate-200 overflow-hidden cursor-pointer', {
                        'border-none': isSystemFileIcon(attachment.mimetype),
                    }, itemClassName), src: presignedUrl || '', name: name, mimetype: mimetype, size: size, children: _jsx("img", { className: "size-full object-contain", src: lgThumbnailUrl ?? getFileCover(mimetype, presignedUrl), alt: name }) }, id));
            }) }) }));
};
