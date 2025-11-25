'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { PlateElement, withHOC } from '@udecode/plate/react';
import { useDraggable } from '@udecode/plate-dnd';
import { Image, useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider,
// useResizableValue
 } from '@udecode/plate-resizable';
import { mediaResizeHandleVariants, Resizable, ResizeHandle } from './resize-handle';
export const ImageElement = withHOC(ResizableProvider, function ImageElement(props) {
    const { align = 'center', focused, readOnly, selected } = useMediaState();
    // const width = useResizableValue('width');
    const { isDragging, handleRef } = useDraggable({
        element: props.element,
    });
    return (_jsxs(PlateElement, { ...props, className: "py-2.5", children: [_jsx("figure", { className: "group relative m-0", contentEditable: false, children: _jsxs(Resizable, { align: align, options: {
                        align,
                        readOnly,
                    }, children: [_jsx(ResizeHandle, { className: mediaResizeHandleVariants({ direction: 'left' }), options: { direction: 'left' } }), _jsx(Image, { ref: handleRef, className: cn('block w-full max-w-full cursor-pointer object-cover px-0', 'rounded-sm', focused && selected && 'ring-2 ring-ring ring-offset-2', isDragging && 'opacity-50'), 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            alt: props.attributes.alt }), _jsx(ResizeHandle, { className: mediaResizeHandleVariants({
                                direction: 'right',
                            }), options: { direction: 'right' } })] }) }), props.children] }));
});
