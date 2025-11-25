import { jsx as _jsx } from "react/jsx-runtime";
import { SlateElement } from '@udecode/plate';
export function LinkElementStatic(props) {
    return (_jsx(SlateElement, { ...props, as: "a", className: "font-medium text-primary underline decoration-primary underline-offset-4", children: props.children }));
}
