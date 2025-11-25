import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { X, ChevronRight, Download } from '@teable/icons';
import { useContext, useMemo } from 'react';
import { Dialog, DialogContent, DialogTrigger, cn } from '../../../shadcn';
import { FilePreview } from './FilePreview';
import { FilePreviewContext } from './FilePreviewContext';
import { Thumb } from './Thumb';
export const FilePreviewContent = (props) => {
    const { container } = props;
    const { files, currentFile, openPreview, closePreview, onPrev, onNext } = useContext(FilePreviewContext);
    const { name, fileId, src } = currentFile || {};
    const open = Boolean(fileId);
    const hiddenLeft = useMemo(() => {
        return files.length < 2 || currentFile?.fileId === files[0].fileId;
    }, [currentFile?.fileId, files]);
    const hiddenRight = useMemo(() => {
        return files.length < 2 || currentFile?.fileId === files[files.length - 1].fileId;
    }, [currentFile?.fileId, files]);
    const clickFileBox = (e) => {
        if ('id' in e.target && e.target.id === 'file-box') {
            closePreview();
        }
    };
    const onDownload = () => {
        if (!name || !src)
            return;
        const downloadLink = document.createElement('a');
        downloadLink.href = src || '';
        downloadLink.target = '_blank';
        downloadLink.download = name;
        downloadLink.click();
    };
    return (_jsxs(Dialog, { open: open, modal: true, children: [_jsx(DialogTrigger, { asChild: true }), _jsx(DialogContent, { container: container, closeable: false, className: "w-full h-full max-w-none bg-black/75 text-white rounded-none px-4 py-0 click-outside-ignore pointer-events-none", onMouseDown: (e) => {
                    e.stopPropagation();
                }, onClick: (e) => e.stopPropagation(), onKeyDown: (e) => {
                    if (e.key === 'Escape') {
                        closePreview();
                    }
                    if (e.key === 'ArrowRight') {
                        onNext();
                    }
                    if (e.key === 'ArrowLeft') {
                        onPrev();
                    }
                    e.stopPropagation();
                }, children: _jsxs("div", { className: "flex flex-col max-h-full overflow-hidden", children: [_jsxs("div", { className: "relative py-4", children: [_jsx("h2", { className: "text-center", children: name }), _jsx("button", { className: "absolute top-4 right-5 p-1 rounded-md hover:bg-black/40", onClick: closePreview, onKeyDown: (e) => {
                                        if (e.key === 'Enter') {
                                            closePreview();
                                        }
                                    }, children: _jsx(X, { className: "text-xl" }) }), _jsx("button", { className: "absolute top-4 left-5 p-1 rounded-md hover:bg-black/40", onClick: onDownload, onKeyDown: (e) => {
                                        if (e.key === 'Enter') {
                                            onDownload();
                                        }
                                    }, children: _jsx(Download, { className: "text-xl" }) })] }), _jsxs("div", { className: "flex-1 relative px-20 overflow-hidden", children: [_jsx("button", { className: cn('absolute left-0 top-[50%] -translate-y-1/2 ml-0.5', hiddenLeft && 'hidden'), onClick: onPrev, children: _jsx(ChevronRight, { className: "rotate-180 text-6xl" }) }), _jsx("div", { id: "file-box", className: "h-full flex items-center justify-center", onClick: clickFileBox, children: _jsx(FilePreview, {}) }), _jsx("button", { className: cn('absolute right-0 top-[50%] -translate-y-1/2 mr-0.5', hiddenRight && 'hidden'), onClick: onNext, children: _jsx(ChevronRight, { className: "text-6xl" }) })] }), _jsx("div", { className: "relative py-4 px-6", children: _jsx("div", { className: "flex justify-center gap-2", children: files.map(({ fileId, ...item }) => (_jsx("button", { className: cn('cursor-pointer rounded-md border-2 border-transparent', fileId === currentFile?.fileId && 'border-2 border-white border-solid p-0'), onClick: () => {
                                        if (fileId !== currentFile?.fileId) {
                                            openPreview(fileId);
                                        }
                                    }, children: _jsx(Thumb, { ...item, fileId }) }, fileId))) }) })] }) })] }));
};
