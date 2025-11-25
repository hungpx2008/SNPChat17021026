import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { IS_APPLE, SlateElement } from '@udecode/plate';
import * as React from 'react';
export function MentionElementStatic(props) {
    const { prefix } = props;
    const element = props.element;
    return (_jsx(SlateElement, { className: cn('inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm font-medium', element.children[0].bold === true && 'font-bold', element.children[0].italic === true && 'italic', element.children[0].underline === true && 'underline'), "data-slate-value": element.value, ...props, children: IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        _jsxs(React.Fragment, { children: [props.children, prefix, element.value] })) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        _jsxs(React.Fragment, { children: [prefix, element.value, props.children] })) }));
}
