import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
declare const TooltipProvider: React.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: {
    (props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
    displayName: string | undefined;
};
declare const TooltipTrigger: React.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const TooltipPortal: React.FC<TooltipPrimitive.TooltipPortalProps>;
declare const TooltipContent: React.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal };
