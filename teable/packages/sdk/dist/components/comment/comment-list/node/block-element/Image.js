import { jsx as _jsx } from "react/jsx-runtime";
import { cn, FilePreviewItem, FilePreviewProvider } from '@teable/ui-lib';
export const BlockImageElement = (props) => {
    const { width, className, url } = props;
    if (!url) {
        return null;
    }
    return (_jsx(FilePreviewProvider, { children: _jsx("div", { className: cn('flex', className), children: _jsx(FilePreviewItem, { src: url, name: "comment-img", mimetype: "image/jpeg", children: _jsx("img", { src: url, width: width || 'auto', alt: "img", className: "cursor-pointer rounded" }) }) }) }));
};
