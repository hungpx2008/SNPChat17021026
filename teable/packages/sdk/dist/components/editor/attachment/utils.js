import { getFileIcon, isImage } from '@teable/ui-lib';
import { renderToString } from 'react-dom/server';
export const getFileCover = (mimetype, url) => {
    if (!url)
        return '';
    if (!isSystemFileIcon(mimetype)) {
        return url;
    }
    return getFieldIconString(mimetype);
};
export const getFieldIconString = (mimetype) => {
    const FileIcon = getFileIcon(mimetype);
    return 'data:image/svg+xml,' + encodeURIComponent(renderToString(FileIcon({})));
};
export const isSystemFileIcon = (mimetype) => {
    return !isImage(mimetype);
};
