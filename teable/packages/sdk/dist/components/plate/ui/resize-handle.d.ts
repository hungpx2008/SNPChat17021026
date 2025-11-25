import { type ResizeHandle as ResizeHandlePrimitive, Resizable as ResizablePrimitive } from '@udecode/plate-resizable';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
export declare const mediaResizeHandleVariants: (props?: ({
    direction?: "left" | "right" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const resizeHandleVariants: (props?: ({
    direction?: "left" | "right" | "bottom" | "top" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function ResizeHandle({ className, direction, options, ...props }: React.ComponentProps<typeof ResizeHandlePrimitive> & VariantProps<typeof resizeHandleVariants>): import("react/jsx-runtime").JSX.Element | null;
declare const resizableVariants: (props?: ({
    align?: "center" | "left" | "right" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function Resizable({ align, className, ...props }: React.ComponentProps<typeof ResizablePrimitive> & VariantProps<typeof resizableVariants>): import("react/jsx-runtime").JSX.Element;
export {};
