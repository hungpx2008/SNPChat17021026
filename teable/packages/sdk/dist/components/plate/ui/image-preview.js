'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useEditorRef } from '@udecode/plate/react';
import { PreviewImage, useImagePreview, useImagePreviewValue, useScaleInput, } from '@udecode/plate-media/react';
import { cva } from 'class-variance-authority';
import { ArrowLeft, ArrowRight, Download, Minus, Plus, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useModalRefElement } from '../../expand-record/useModalRefElement';
const toolButtonVariants = cva('rounded bg-[rgba(0,0,0,0.5)] px-1', {
    defaultVariants: {
        variant: 'default',
    },
    variants: {
        variant: {
            default: 'text-white',
            disabled: 'cursor-not-allowed text-gray-400',
        },
    },
});
const SCROLL_SPEED = 4;
export const ImagePreview = () => {
    const editor = useEditorRef();
    const isOpen = useImagePreviewValue('isOpen', editor.id);
    const scale = useImagePreviewValue('scale');
    const isEditingScale = useImagePreviewValue('isEditingScale');
    const { closeProps, currentUrlIndex, maskLayerProps, nextDisabled, nextProps, prevDisabled, prevProps, scaleTextProps, zommOutProps, zoomInDisabled, zoomInProps, zoomOutDisabled, } = useImagePreview({ scrollSpeed: SCROLL_SPEED });
    const modalElementRef = useModalRefElement();
    if (!modalElementRef.current)
        return null;
    return createPortal(_jsxs("div", { className: cn('fixed top-0 left-0 z-50 size-full select-none', !isOpen && 'hidden'), onContextMenu: (e) => e.stopPropagation(), ...maskLayerProps, children: [_jsx("div", { className: "absolute inset-0 size-full bg-black opacity-30" }), _jsx("div", { className: "absolute inset-0 size-full bg-black opacity-30" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "relative flex max-h-screen w-full items-center", children: [_jsx(PreviewImage, { className: cn('mx-auto block max-h-[calc(100vh-4rem)] w-auto object-contain transition-transform') }), _jsxs("div", { className: "absolute bottom-0 left-1/2 z-40 flex w-fit -translate-x-1/2 justify-center gap-4 p-2 text-center text-white", onClick: (e) => e.stopPropagation(), onKeyDown: (e) => {
                                e.stopPropagation();
                            }, role: "button", tabIndex: 0, children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("button", { ...prevProps, className: cn(toolButtonVariants({
                                                variant: prevDisabled ? 'disabled' : 'default',
                                            })), type: "button", children: _jsx(ArrowLeft, {}) }), (currentUrlIndex ?? 0) + 1, _jsx("button", { ...nextProps, className: cn(toolButtonVariants({
                                                variant: nextDisabled ? 'disabled' : 'default',
                                            })), type: "button", children: _jsx(ArrowRight, {}) })] }), _jsxs("div", { className: "flex", children: [_jsx("button", { className: cn(toolButtonVariants({
                                                variant: zoomOutDisabled ? 'disabled' : 'default',
                                            })), ...zommOutProps, type: "button", children: _jsx(Minus, { className: "size-4" }) }), _jsx("div", { className: "mx-px", children: isEditingScale ? (_jsxs(_Fragment, { children: [_jsx(ScaleInput, { className: "w-10 rounded px-1 text-slate-500 outline" }), ' ', _jsx("span", { children: "%" })] })) : (_jsx("span", { ...scaleTextProps, children: scale * 100 + '%' })) }), _jsx("button", { className: cn(toolButtonVariants({
                                                variant: zoomInDisabled ? 'disabled' : 'default',
                                            })), ...zoomInProps, type: "button", children: _jsx(Plus, { className: "size-4" }) })] }), _jsx("button", { className: cn(toolButtonVariants()), type: "button", children: _jsx(Download, { className: "size-4" }) }), _jsx("button", { ...closeProps, className: cn(toolButtonVariants()), type: "button", children: _jsx(X, { className: "size-4" }) })] })] }) })] }), modalElementRef.current);
};
export function ScaleInput(props) {
    const { props: scaleInputProps, ref } = useScaleInput();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return _jsx("input", { ...scaleInputProps, ...props, ref: ref });
}
