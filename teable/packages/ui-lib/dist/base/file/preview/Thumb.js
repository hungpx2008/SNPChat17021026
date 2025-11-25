import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { getFileIcon } from './getFileIcon';
import { isImage } from './utils';
export const Thumb = (props) => {
    const { thumb, mimetype, src, name } = props;
    const FileIcon = useMemo(() => getFileIcon(mimetype), [mimetype]);
    if (thumb || isImage(mimetype)) {
        return _jsx("img", { className: "w-6 h-6 rounded-sm", src: src || mimetype, alt: name });
    }
    return _jsx(FileIcon, { className: "w-6 h-6 rounded-sm" });
};
