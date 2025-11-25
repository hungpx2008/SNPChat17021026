'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { cn } from '../utils';
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (_jsx(AccordionPrimitive.Item, { ref: ref, className: cn('border-b', className), ...props })));
AccordionItem.displayName = 'AccordionItem';
// update the AccordionTrigger component to accept a hiddenChevron prop
const AccordionTrigger = React.forwardRef(({ className, children, hiddenChevron, headerClassName, ...props }, ref) => (_jsx(AccordionPrimitive.Header, { className: cn('flex', headerClassName), children: _jsxs(AccordionPrimitive.Trigger, { ref: ref, className: cn('flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180', className), ...props, children: [children, !hiddenChevron && (_jsx(ChevronDownIcon, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }))] }) })));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (_jsx(AccordionPrimitive.Content, { ref: ref, className: cn('overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', className), ...props, children: _jsx("div", { className: "pb-3", children: children }) })));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
