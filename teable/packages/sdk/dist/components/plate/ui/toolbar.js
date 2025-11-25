import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ChevronDown } from '@teable/icons';
import { cn, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator, Separator, Tooltip, TooltipTrigger, } from '@teable/ui-lib';
import { cva } from 'class-variance-authority';
import * as React from 'react';
export function Toolbar({ className, ...props }) {
    return (_jsx(ToolbarPrimitive.Root, { className: cn('relative flex items-center select-none', className), ...props }));
}
export function ToolbarToggleGroup({ className, ...props }) {
    return (_jsx(ToolbarPrimitive.ToolbarToggleGroup, { className: cn('flex items-center', className), ...props }));
}
export function ToolbarLink({ className, ...props }) {
    return (_jsx(ToolbarPrimitive.Link, { className: cn('font-medium underline underline-offset-4', className), ...props }));
}
export function ToolbarSeparator({ className, ...props }) {
    return (_jsx(ToolbarPrimitive.Separator, { className: cn('mx-2 my-1 w-px shrink-0 bg-border', className), ...props }));
}
// From toggleVariants
const toolbarButtonVariants = cva("aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus-visible:ring-DEFAULT inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,box-shadow] hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-checked:bg-accent aria-checked:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    defaultVariants: {
        size: 'default',
        variant: 'default',
    },
    variants: {
        size: {
            default: 'h-9 min-w-9 px-2',
            lg: 'h-10 min-w-10 px-2.5',
            sm: 'h-8 min-w-8 px-1.5',
            xs: 'h-6 min-w-6 px-1',
        },
        variant: {
            default: 'bg-transparent',
            outline: 'shadow-xs border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        },
    },
});
const dropdownArrowVariants = cva(cn('inline-flex items-center justify-center rounded-r-md text-sm font-medium text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50'), {
    defaultVariants: {
        size: 'sm',
        variant: 'default',
    },
    variants: {
        size: {
            default: 'h-9 w-6',
            lg: 'h-10 w-8',
            sm: 'h-8 w-4',
        },
        variant: {
            default: 'bg-transparent hover:bg-muted hover:text-muted-foreground aria-checked:bg-accent aria-checked:text-accent-foreground',
            outline: 'border border-l-0 border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        },
    },
});
export const ToolbarButton = withTooltip(function ToolbarButton({ children, className, isDropdown, pressed, size = 'sm', variant, ...props }) {
    return typeof pressed === 'boolean' ? (_jsx(ToolbarToggleGroup, { disabled: props.disabled, value: "single", type: "single", children: _jsx(ToolbarToggleItem, { className: cn(toolbarButtonVariants({
                size,
                variant,
            }), isDropdown && 'justify-between gap-1 pr-1', className), value: pressed ? 'single' : '', ...props, children: isDropdown ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex flex-1 items-center gap-2 whitespace-nowrap", children: children }), _jsx("div", { children: _jsx(ChevronDown, { className: "size-3.5 text-muted-foreground", "data-icon": true }) })] })) : (children) }) })) : (_jsx(ToolbarPrimitive.Button, { className: cn(toolbarButtonVariants({
            size,
            variant,
        }), isDropdown && 'pr-1', className), ...props, children: children }));
});
export function ToolbarSplitButton({ className, ...props }) {
    return (_jsx(ToolbarButton, { className: cn('group flex gap-0 px-0 hover:bg-transparent', className), ...props }));
}
export function ToolbarSplitButtonPrimary({ children, className, size = 'sm', variant, ...props }) {
    return (_jsx("span", { className: cn(toolbarButtonVariants({
            size,
            variant,
        }), 'rounded-r-none', 'group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground', className), ...props, children: children }));
}
export function ToolbarSplitButtonSecondary({ className, size, variant, ...props }) {
    return (_jsx("span", { className: cn(dropdownArrowVariants({
            size,
            variant,
        }), 'group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground', className), onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), role: "button", tabIndex: 0, ...props, children: _jsx(ChevronDown, { className: "size-3.5 text-muted-foreground", "data-icon": true }) }));
}
export function ToolbarToggleItem({ className, size = 'sm', variant, ...props }) {
    return (_jsx(ToolbarPrimitive.ToggleItem, { className: cn(toolbarButtonVariants({ size, variant }), className), ...props }));
}
export function ToolbarGroup({ children, className }) {
    return (_jsxs("div", { className: cn('group/toolbar-group', 'relative hidden has-[button]:flex', className), children: [_jsx("div", { className: "flex items-center", children: children }), _jsx("div", { className: "group-last/toolbar-group:hidden! mx-1.5 py-0.5", children: _jsx(Separator, { orientation: "vertical" }) })] }));
}
function withTooltip(Component) {
    return function ExtendComponent({ tooltip, tooltipContentProps, tooltipProps, tooltipTriggerProps, ...props }) {
        const [mounted, setMounted] = React.useState(false);
        React.useEffect(() => {
            setMounted(true);
        }, []);
        const component = _jsx(Component, { ...props });
        if (tooltip && mounted) {
            return (_jsxs(Tooltip, { ...tooltipProps, children: [_jsx(TooltipTrigger, { ...tooltipTriggerProps, children: component }), _jsx(TooltipContent, { ...tooltipContentProps, children: tooltip })] }));
        }
        return component;
    };
}
function TooltipContent({ children, className, 
// CHANGE
sideOffset = 4, ...props }) {
    return (_jsx(TooltipPrimitive.Portal, { children: _jsx(TooltipPrimitive.Content, { className: cn('z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground', className), "data-slot": "tooltip-content", sideOffset: sideOffset, ...props, children: children }) }));
}
export function ToolbarMenuGroup({ children, className, label, ...props }) {
    return (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, { className: cn('hidden', 'mb-0 shrink-0 peer-has-[[role=menuitem]]/menu-group:block peer-has-[[role=menuitemradio]]/menu-group:block peer-has-[[role=option]]/menu-group:block') }), _jsxs(DropdownMenuRadioGroup, { ...props, className: cn('hidden', 'peer/menu-group group/menu-group my-1.5 has-[[role=menuitem]]:block has-[[role=menuitemradio]]:block has-[[role=option]]:block', className), children: [label && (_jsx(DropdownMenuLabel, { className: "select-none text-xs font-semibold text-muted-foreground", children: label })), children] })] }));
}
