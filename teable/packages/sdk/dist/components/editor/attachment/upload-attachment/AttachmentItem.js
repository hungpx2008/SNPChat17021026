import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Download, X } from '@teable/icons';
import { Button, cn, FilePreviewItem } from '@teable/ui-lib';
import { isSystemFileIcon } from '../utils';
function AttachmentItem(props) {
    const { attachment, onDelete, fileCover, downloadFile, readonly } = props;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: attachment.id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (_jsx("div", { ref: setNodeRef, style: style, ...attributes, ...listeners, children: _jsxs("li", { className: "mb-2 flex h-32 w-28 flex-col pr-3", children: [_jsxs("div", { className: cn('group relative flex-1 cursor-pointer overflow-hidden rounded-md border border-border', {
                        'border-none': isSystemFileIcon(attachment.mimetype),
                    }), children: [_jsx(FilePreviewItem, { className: "flex items-center justify-center", src: attachment.presignedUrl || '', name: attachment.name, mimetype: attachment.mimetype, size: attachment.size, children: _jsx("img", { className: "size-full object-contain", src: fileCover(attachment), alt: attachment.name }) }), _jsxs("ul", { className: "absolute right-0 top-0 hidden w-full justify-end space-x-1 bg-black/40 p-1 group-hover:flex", children: [_jsx("li", { children: _jsx(Button, { variant: 'ghost', className: "size-5 rounded-full p-0 text-white focus-visible:ring-transparent focus-visible:ring-offset-0", onClick: (e) => {
                                            e.stopPropagation();
                                            downloadFile(attachment);
                                        }, children: _jsx(Download, {}) }) }), _jsx("li", { children: !readonly && (_jsx(Button, { variant: 'ghost', className: "size-5 rounded-full p-0 text-white focus-visible:ring-transparent focus-visible:ring-offset-0", onClick: (e) => {
                                            e.stopPropagation();
                                            onDelete(attachment.id);
                                        }, children: _jsx(X, {}) })) })] })] }), _jsx("span", { className: "mt-1 w-full truncate text-center", title: attachment.name, children: attachment.name })] }, attachment.id) }));
}
export default AttachmentItem;
