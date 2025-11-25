import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { PlateContent } from '@udecode/plate/react';
import { cva } from 'class-variance-authority';
import React from 'react';
const editorVariants = cva(cn('relative overflow-x-auto whitespace-pre-wrap break-words', 'min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none', '[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100', '[&_[data-slate-placeholder]]:top-[auto_!important]', '[&_strong]:font-bold'), {
    variants: {
        variant: {
            outline: 'border border-input',
            ghost: '',
        },
        focused: {
            true: 'ring-2 ring-ring ring-offset-2',
        },
        disabled: {
            true: 'cursor-not-allowed opacity-50',
        },
        focusRing: {
            true: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            false: '',
        },
        size: {
            sm: 'text-sm',
            md: 'text-base',
        },
    },
    defaultVariants: {
        variant: 'outline',
        focusRing: true,
        size: 'sm',
    },
});
const Editor = React.forwardRef(({ className, disabled, focused, focusRing, readOnly, size, variant, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: "relative w-full", children: _jsx(PlateContent, { className: cn(editorVariants({
                disabled,
                focused,
                focusRing,
                size,
                variant,
            }), className), disableDefaultStyles: true, readOnly: disabled ?? readOnly, "aria-disabled": disabled, ...props }) }));
});
Editor.displayName = 'Editor';
export { Editor };
