import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useEffect, useRef } from 'react';
import { cn } from '../../../shadcn';
import { FilePreviewContext } from './FilePreviewContext';
import { genFileId } from './genFileId';
export const FilePreviewItem = (props) => {
    const { children, className, ...fileItem } = props;
    const { openPreview, mergeFiles, onDelete } = useContext(FilePreviewContext);
    const fileIdRef = useRef(genFileId());
    const oldFileItemRef = useRef();
    useEffect(() => {
        const fileId = fileIdRef.current;
        const isItemChange = fileItem !== oldFileItemRef.current;
        if (isItemChange) {
            oldFileItemRef.current === fileItem;
            mergeFiles({ ...fileItem, fileId });
        }
    }, [fileItem, mergeFiles]);
    useEffect(() => {
        const fileId = fileIdRef.current;
        return () => {
            fileId && onDelete(fileId);
        };
    }, [onDelete]);
    return (_jsx("div", { className: cn('size-full', className), role: "button", tabIndex: 0, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                openPreview(fileIdRef.current);
                e.stopPropagation();
                e.preventDefault();
            }
        }, onClick: (e) => {
            e.stopPropagation();
            openPreview(fileIdRef.current);
        }, children: children }));
};
