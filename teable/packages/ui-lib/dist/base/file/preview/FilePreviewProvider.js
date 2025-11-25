import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { FilePreviewContent } from './FilePreviewContent';
import { FilePreviewContext } from './FilePreviewContext';
export const FilePreviewProvider = (props) => {
    const { children, container, i18nMap } = props;
    const [current, setCurrent] = useState();
    const [files, setFiles] = useState([]);
    const currentFile = useMemo(() => files.find(({ fileId }) => fileId === current), [current, files]);
    const openPreview = useCallback((fileId) => {
        setCurrent(fileId ?? 0);
    }, []);
    const closePreview = useCallback(() => {
        setCurrent(undefined);
    }, []);
    const mergeFiles = useCallback((item) => {
        setFiles((pre) => {
            const index = pre.findIndex((v) => v.fileId === item.fileId);
            if (index === -1) {
                return [...pre, item];
            }
            if (JSON.stringify(pre[index]) === JSON.stringify(item)) {
                return pre;
            }
            const newFiles = [...pre];
            newFiles.splice(index, 1, item);
            return newFiles;
        });
    }, []);
    const resetFiles = useCallback((files) => {
        setFiles(files ?? []);
    }, []);
    const onDelete = useCallback((fileId) => {
        setFiles((pre) => {
            const index = pre.findIndex((file) => file.fileId === fileId);
            if (index > -1) {
                setCurrent((preCurrent) => preCurrent === fileId ? pre[index > 0 ? index - 1 : 0].fileId : preCurrent);
                return pre.filter((file) => file.fileId !== fileId);
            }
            return pre;
        });
    }, []);
    const onPrev = useCallback(() => {
        const index = files.findIndex(({ fileId }) => fileId === current);
        if (index === -1) {
            return;
        }
        const prevIndex = index - 1;
        if (prevIndex < 0) {
            return;
        }
        setCurrent(files[prevIndex].fileId);
    }, [current, files]);
    const onNext = useCallback(() => {
        const index = files.findIndex(({ fileId }) => fileId === current);
        if (index === -1) {
            return;
        }
        const nextIndex = index + 1;
        if (nextIndex >= files.length) {
            return;
        }
        setCurrent(files[nextIndex].fileId);
    }, [current, files]);
    return (_jsxs(FilePreviewContext.Provider, { value: {
            currentFile,
            files,
            mergeFiles,
            resetFiles,
            onDelete,
            openPreview,
            closePreview,
            onPrev,
            onNext,
            i18nMap: i18nMap,
        }, children: [children, files.length > 0 && _jsx(FilePreviewContent, { container: container })] }));
};
