'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEditorRef, useEditorSelection, useFormInputProps, usePluginOption, } from '@udecode/plate/react';
import { flip, offset } from '@udecode/plate-floating';
import { getLinkAttributes } from '@udecode/plate-link';
import { FloatingLinkUrlInput, LinkPlugin, useFloatingLinkEdit, useFloatingLinkEditState, useFloatingLinkInsert, useFloatingLinkInsertState, } from '@udecode/plate-link/react';
import { cva } from 'class-variance-authority';
import { ExternalLink, Link, Text, Unlink } from 'lucide-react';
import * as React from 'react';
import { useClickAway } from 'react-use';
import { useTranslation } from '../../../context/app/i18n';
import { buttonVariants } from './button';
import { Separator } from './separator';
const popoverVariants = cva('outline-hidden z-50 w-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md');
const inputVariants = cva('flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent md:text-sm');
export function LinkFloatingToolbar({ state }) {
    const activeCommentId = usePluginOption({ key: 'comment' }, 'activeId');
    const activeSuggestionId = usePluginOption({ key: 'suggestion' }, 'activeId');
    const { t } = useTranslation();
    const editor = useEditorRef();
    const floatingOptions = React.useMemo(() => {
        return {
            middleware: [
                offset(8),
                flip({
                    fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
                    padding: 12,
                }),
            ],
            placement: activeSuggestionId || activeCommentId ? 'top-start' : 'bottom-start',
        };
    }, [activeCommentId, activeSuggestionId]);
    const insertState = useFloatingLinkInsertState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const { hidden, props: insertProps, ref: insertRef, textInputProps, } = useFloatingLinkInsert(insertState);
    const editState = useFloatingLinkEditState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const { editButtonProps, props: editProps, ref: editRef, unlinkButtonProps, } = useFloatingLinkEdit(editState);
    const inputProps = useFormInputProps({
        preventDefaultOnEnterKeydown: true,
    });
    const ref = React.useRef(null);
    const inputRef = React.useRef(null);
    useClickAway(ref, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inputRef.current?.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
        }));
    });
    if (hidden)
        return null;
    const input = (_jsxs("div", { className: "flex w-[330px] flex-col", ...inputProps, ref: ref, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center pl-2 pr-1 text-muted-foreground", children: _jsx(Link, { className: "size-4" }) }), _jsx(FloatingLinkUrlInput, { ref: inputRef, className: inputVariants(), placeholder: t('comment.floatToolbar.enterUrl'), "data-plate-focus": true, onKeyDown: (e) => {
                            if (e.key === 'Escape') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                editor?.api?.floatingLink?.hide();
                                e.stopPropagation();
                            }
                        } })] }), _jsx(Separator, { className: "my-1" }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center pl-2 pr-1 text-muted-foreground", children: _jsx(Text, { className: "size-4" }) }), _jsx("input", { className: inputVariants(), placeholder: t('comment.floatToolbar.linkText'), "data-plate-focus": true, ...textInputProps, onKeyDown: (e) => {
                            if (e.key === 'Escape') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                editor?.api?.floatingLink?.hide();
                                e.stopPropagation();
                            }
                        } })] })] }));
    const editContent = editState.isEditing ? (input) : (_jsxs("div", { className: "box-content flex items-center", children: [_jsx("button", { className: buttonVariants({ size: 'sm', variant: 'ghost' }), type: "button", ...editButtonProps, children: t('comment.floatToolbar.editLink') }), _jsx(Separator, { orientation: "vertical" }), _jsx(LinkOpenButton, {}), _jsx(Separator, { orientation: "vertical" }), _jsx("button", { className: buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                }), type: "button", ...unlinkButtonProps, children: _jsx(Unlink, { width: 18 }) })] }));
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: insertRef, className: popoverVariants(), ...insertProps, children: input }), _jsx("div", { ref: editRef, className: popoverVariants(), ...editProps, children: editContent })] }));
}
function LinkOpenButton() {
    const editor = useEditorRef();
    const selection = useEditorSelection();
    const attributes = React.useMemo(() => {
        const entry = editor.api.node({
            match: { type: editor.getType(LinkPlugin) },
        });
        if (!entry) {
            return {};
        }
        const [element] = entry;
        return getLinkAttributes(editor, element);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]);
    return (_jsx("a", { ...attributes, className: buttonVariants({
            size: 'icon',
            variant: 'ghost',
        }), onMouseOver: (e) => {
            e.stopPropagation();
        }, onFocus: (e) => {
            e.stopPropagation();
        }, "aria-label": "Open link in a new tab", target: "_blank", children: _jsx(ExternalLink, { width: 18 }) }));
}
