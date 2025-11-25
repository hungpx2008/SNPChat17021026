import type { PlateElementProps } from '@udecode/plate/react';
import type { TMentionElement } from '@udecode/plate-mention';
import * as React from 'react';
export declare function MentionElement(props: PlateElementProps<TMentionElement> & {
    prefix?: string;
    render?: (mentionable: any) => React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
