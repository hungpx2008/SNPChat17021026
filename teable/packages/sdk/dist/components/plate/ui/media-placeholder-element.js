'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CommentNodeType } from '@teable/openapi';
import { cn } from '@teable/ui-lib';
import { PlateElement, useEditorPlugin, withHOC } from '@udecode/plate/react';
import { AudioPlugin, FilePlugin, ImagePlugin, PlaceholderPlugin, PlaceholderProvider, updateUploadHistory, VideoPlugin, } from '@udecode/plate-media/react';
import { AudioLines, FileUp, Film, ImageIcon, Loader2Icon } from 'lucide-react';
import * as React from 'react';
import { useFilePicker } from 'use-file-picker';
import { useUploadFile } from './hooks/useUploadFile';
const CONTENT = {
    [AudioPlugin.key]: {
        accept: ['audio/*'],
        content: 'Add an audio file',
        icon: _jsx(AudioLines, {}),
    },
    [FilePlugin.key]: {
        accept: ['*'],
        content: 'Add a file',
        icon: _jsx(FileUp, {}),
    },
    [ImagePlugin.key]: {
        accept: ['image/*'],
        content: 'Add an image',
        icon: _jsx(ImageIcon, {}),
    },
    [VideoPlugin.key]: {
        accept: ['video/*'],
        content: 'Add a video',
        icon: _jsx(Film, {}),
    },
};
export const MediaPlaceholderElement = withHOC(PlaceholderProvider, function MediaPlaceholderElement(props) {
    const { editor, element } = props;
    const { api } = useEditorPlugin(PlaceholderPlugin);
    const { isUploading, progress, uploadedFile, uploadFile, uploadingFile } = useUploadFile();
    const loading = isUploading && uploadingFile;
    const currentContent = CONTENT[element.mediaType];
    const isImage = element.mediaType === ImagePlugin.key;
    const imageRef = React.useRef(null);
    const { openFilePicker } = useFilePicker({
        accept: currentContent.accept,
        multiple: true,
        onFilesSelected: ({ plainFiles: updatedFiles }) => {
            const firstFile = updatedFiles[0];
            const restFiles = updatedFiles.slice(1);
            replaceCurrentPlaceholder(firstFile);
            if (restFiles.length > 0) {
                editor.getTransforms(PlaceholderPlugin).insert.media(restFiles);
            }
        },
    });
    const replaceCurrentPlaceholder = React.useCallback((file) => {
        void uploadFile(file);
        api.placeholder.addUploadingFile(element.id, file);
    }, [api.placeholder, element.id, uploadFile]);
    React.useEffect(() => {
        if (!uploadedFile)
            return;
        const path = editor.api.findPath(element);
        const previousNode = editor.api.previous({ at: path });
        if (!path)
            return;
        editor.tf.withoutSaving(() => {
            editor.tf.removeNodes({ at: path });
            const node = {
                children: [{ text: '' }],
                initialHeight: imageRef.current?.height,
                initialWidth: imageRef.current?.width,
                isUpload: true,
                name: element.mediaType === FilePlugin.key ? uploadedFile.name : '',
                placeholderId: element.id,
                type: element.mediaType,
                url: uploadedFile.url,
                path: uploadedFile.path,
            };
            if (previousNode?.[0]?.type === CommentNodeType.Img || !previousNode) {
                editor.tf.insertNodes(node, { at: path, nextBlock: true });
            }
            else {
                editor.tf.insertNodes(node, { at: path });
            }
            editor.tf.focus();
            updateUploadHistory(editor, node);
        });
        api.placeholder.removeUploadingFile(element.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedFile, element.id]);
    // React dev mode will call React.useEffect twice
    const isReplaced = React.useRef(false);
    /** Paste and drop */
    React.useEffect(() => {
        if (isReplaced.current)
            return;
        isReplaced.current = true;
        const currentFiles = api.placeholder.getUploadingFile(element.id);
        if (!currentFiles)
            return;
        replaceCurrentPlaceholder(currentFiles);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReplaced]);
    return (_jsxs(PlateElement, { className: "my-1", ...props, children: [(!loading || !isImage) && (_jsxs("div", { className: cn('flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 select-none hover:bg-primary/10'), onClick: () => !loading && openFilePicker(), contentEditable: false, onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                        openFilePicker();
                    }
                }, role: "button", tabIndex: 0, children: [_jsx("div", { className: "relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6", children: currentContent.icon }), _jsxs("div", { className: "whitespace-nowrap text-sm text-muted-foreground", children: [_jsx("div", { children: loading ? uploadingFile?.name : currentContent.content }), loading && !isImage && (_jsxs("div", { className: "mt-1 flex items-center gap-1.5", children: [_jsx("div", { children: formatBytes(uploadingFile?.size ?? 0) }), _jsx("div", { children: "\u2013" }), _jsxs("div", { className: "flex items-center", children: [_jsx(Loader2Icon, { className: "mr-1 size-3.5 animate-spin text-muted-foreground" }), progress ?? 0, "%"] })] }))] })] })), isImage && loading && (_jsx(ImageProgress, { file: uploadingFile, imageRef: imageRef, progress: progress })), props.children] }));
});
export function ImageProgress({ className, file, imageRef, progress = 0, }) {
    const [objectUrl, setObjectUrl] = React.useState(null);
    React.useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);
    if (!objectUrl) {
        return null;
    }
    return (_jsxs("div", { className: cn('relative', className), contentEditable: false, children: [_jsx("img", { 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref: imageRef, className: "h-auto w-full rounded-sm object-cover", alt: file.name, src: objectUrl }), progress < 100 && (_jsxs("div", { className: "absolute bottom-1 right-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5", children: [_jsx(Loader2Icon, { className: "size-3.5 animate-spin text-muted-foreground" }), _jsxs("span", { className: "text-xs font-medium text-white", children: [Math.round(progress), "%"] })] }))] }));
}
export function formatBytes(bytes, opts = {}) {
    const { decimals = 0, sizeType = 'normal' } = opts;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    if (bytes === 0)
        return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'}`;
}
