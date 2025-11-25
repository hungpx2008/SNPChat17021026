import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useMemo } from 'react';
import { cn } from '../../../shadcn';
import { AudioPreview } from './audio/AudioPreview';
import { FilePreviewContext } from './FilePreviewContext';
import { getFileIcon } from './getFileIcon';
import { ImagePreview } from './image/ImagePreview';
import { ExcelPreview } from './office/ExcelPreview';
import { WordPreview } from './office/WordPreview';
import { PDFPreview } from './pdf/PDFPreview';
import { isAudio, isImage, isVideo, isPdf, isWord, isExcel } from './utils';
import { VideoPreview } from './video/VideoPreview';
export const FilePreview = (props) => {
    const { className } = props;
    const { currentFile } = useContext(FilePreviewContext);
    const mimetype = currentFile?.mimetype;
    const FileIcon = useMemo(() => (mimetype ? getFileIcon(mimetype) : ''), [mimetype]);
    if (!mimetype || !FileIcon) {
        return null;
    }
    switch (true) {
        case isImage(mimetype):
            return _jsx(ImagePreview, { ...currentFile });
        case isVideo(mimetype):
            return _jsx(VideoPreview, { ...currentFile });
        case isAudio(mimetype):
            return _jsx(AudioPreview, { ...currentFile });
        case isPdf(mimetype):
            return _jsx(PDFPreview, { ...currentFile });
        case isWord(mimetype):
            return _jsx(WordPreview, { ...currentFile });
        case isExcel(mimetype):
            return _jsx(ExcelPreview, { ...currentFile });
        default:
            return _jsx(FileIcon, { className: cn('max-w-max max-h-max w-40 h-40 ', className) });
    }
};
