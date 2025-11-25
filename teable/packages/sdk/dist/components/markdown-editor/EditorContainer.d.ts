import type { PlateContentProps } from '@udecode/plate/react';
import type { VariantProps } from 'class-variance-authority';
import React from 'react';
declare const editorVariants: (props?: ({
    variant?: "ghost" | "outline" | null | undefined;
    focused?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    focusRing?: boolean | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type EditorProps = PlateContentProps & VariantProps<typeof editorVariants>;
declare const EditorContainer: React.ForwardRefExoticComponent<Omit<import("@udecode/plate").EditableProps, "decorate"> & {
    autoFocusOnEditable?: boolean | undefined;
    decorate?: ((options: {
        editor: import("@udecode/plate/react").PlateEditor;
        entry: import("@udecode/plate").NodeEntry;
    }) => import("@udecode/plate").TRange[]) | null | undefined;
    disabled?: boolean | undefined;
    renderEditable?: ((editable: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => React.ReactNode) | undefined;
} & VariantProps<(props?: ({
    variant?: "ghost" | "outline" | null | undefined;
    focused?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    focusRing?: boolean | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & React.RefAttributes<HTMLDivElement>>;
export { EditorContainer };
