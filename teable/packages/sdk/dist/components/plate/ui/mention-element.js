'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { IS_APPLE } from '@udecode/plate';
import { PlateElement, useFocused, useReadOnly, useSelected } from '@udecode/plate/react';
import * as React from 'react';
import { useMounted } from './hooks/useMounted';
export function MentionElement(props) {
    const element = props.element;
    const selected = useSelected();
    const focused = useFocused();
    const mounted = useMounted();
    const readOnly = useReadOnly();
    return (_jsx(PlateElement, { ...props, className: cn('inline-block rounded-md bg-muted px-1.5 py-0 align-baseline text-sm font-medium mx-0.5 bg-slate-100 dark:bg-slate-800', !readOnly && 'cursor-pointer', selected && focused && 'ring-2 ring-ring', element.children[0].bold === true && 'font-bold', element.children[0].italic === true && 'italic', element.children[0].underline === true && 'underline'), attributes: {
            ...props.attributes,
            contentEditable: false,
            'data-slate-value': element.value,
            draggable: true,
        }, children: mounted && IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        _jsxs(React.Fragment, { children: [props.children, props.prefix, props.render ? props.render(element) : element.value] })) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        _jsxs(React.Fragment, { children: [props.prefix, props.render ? props.render(element) : element.value, props.children] })) }));
}
