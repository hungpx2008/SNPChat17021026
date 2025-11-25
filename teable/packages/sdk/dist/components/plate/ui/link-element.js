'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { PlateElement } from '@udecode/plate/react';
import { useLink } from '@udecode/plate-link/react';
export function LinkElement(props) {
    const { props: linkProps } = useLink({ element: props.element });
    return (_jsx(PlateElement, { ...props, as: "a", className: "font-medium text-primary underline decoration-primary underline-offset-4", attributes: {
            ...props.attributes,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...linkProps,
        }, children: props.children }));
}
