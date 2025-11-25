'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, sonner, } from '@teable/ui-lib';
import { isUrl } from '@udecode/plate';
import { useEditorRef } from '@udecode/plate/react';
import { AudioPlugin, FilePlugin, ImagePlugin, PlaceholderPlugin, VideoPlugin, } from '@udecode/plate-media/react';
import { AudioLinesIcon, FileUpIcon, FilmIcon, ImageIcon } from 'lucide-react';
import * as React from 'react';
import { useFilePicker } from 'use-file-picker';
import { useTranslation } from '../../../context/app/i18n';
import { Input } from './input';
import { ToolbarSplitButton, ToolbarSplitButtonPrimary,
// ToolbarSplitButtonSecondary,
 } from './toolbar';
const { toast } = sonner;
const MEDIA_CONFIG = {
    [AudioPlugin.key]: {
        accept: ['audio/*'],
        icon: _jsx(AudioLinesIcon, { className: "size-4" }),
        title: 'Insert Audio',
        tooltip: 'Audio',
    },
    [FilePlugin.key]: {
        accept: ['*'],
        icon: _jsx(FileUpIcon, { className: "size-4" }),
        title: 'Insert File',
        tooltip: 'File',
    },
    [ImagePlugin.key]: {
        accept: ['image/*'],
        icon: _jsx(ImageIcon, { className: "size-3.5" }),
        title: 'Insert Image',
        tooltip: 'Image',
    },
    [VideoPlugin.key]: {
        accept: ['video/*'],
        icon: _jsx(FilmIcon, { className: "size-4" }),
        title: 'Insert Video',
        tooltip: 'Video',
    },
};
export function MediaToolbarButton({ nodeType,
// ...props
 }) {
    const currentConfig = MEDIA_CONFIG[nodeType];
    const editor = useEditorRef();
    const [open, setOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const { openFilePicker } = useFilePicker({
        accept: currentConfig.accept,
        multiple: false,
        onFilesSelected: ({ plainFiles: updatedFiles }) => {
            editor.getTransforms(PlaceholderPlugin).insert.media(updatedFiles);
        },
    });
    const { t } = useTranslation();
    return (_jsxs(_Fragment, { children: [_jsx(ToolbarSplitButton, { size: "xs", onClick: () => {
                    openFilePicker();
                }, onKeyDown: (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                    }
                }, pressed: open, tooltip: t('comment.toolbar.image'), children: _jsx(ToolbarSplitButtonPrimary, { className: "rounded-md", size: "xs", children: currentConfig.icon }) }), _jsx(AlertDialog, { open: dialogOpen, onOpenChange: (value) => {
                    setDialogOpen(value);
                }, children: _jsx(AlertDialogContent, { className: "gap-6", children: _jsx(MediaUrlDialogContent, { currentConfig: currentConfig, nodeType: nodeType, setOpen: setDialogOpen }) }) })] }));
}
function MediaUrlDialogContent({ currentConfig, nodeType, setOpen, }) {
    const editor = useEditorRef();
    const [url, setUrl] = React.useState('');
    const embedMedia = React.useCallback(() => {
        if (!isUrl(url))
            return toast('Invalid URL');
        setOpen(false);
        editor.tf.insertNodes({
            children: [{ text: '' }],
            name: nodeType === FilePlugin.key ? url.split('/').pop() : undefined,
            type: nodeType,
            url,
        });
    }, [url, editor, nodeType, setOpen]);
    return (_jsxs(_Fragment, { children: [_jsx(AlertDialogHeader, { children: _jsx(AlertDialogTitle, { children: currentConfig.title }) }), _jsxs(AlertDialogDescription, { className: "group relative w-full", children: [_jsx("label", { className: "absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground", htmlFor: "url", children: _jsx("span", { className: "inline-flex bg-background px-2", children: "URL" }) }), _jsx(Input, { id: "url", className: "w-full", value: url, onChange: (e) => setUrl(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter')
                                embedMedia();
                        }, placeholder: "", type: "url", 
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus: true })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Cancel" }), _jsx(AlertDialogAction, { onClick: (e) => {
                            e.preventDefault();
                            embedMedia();
                        }, children: "Accept" })] })] }));
}
