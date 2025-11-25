import type { ForwardRefRenderFunction } from 'react';
import type { ICellEditor, IEditorRef } from '../type';
export declare const NumberEditorBase: ForwardRefRenderFunction<IEditorRef<number>, ICellEditor<number | null> & {
    placeholder?: string;
    saveOnChange?: boolean;
}>;
export declare const NumberEditor: import("react").ForwardRefExoticComponent<ICellEditor<number | null> & {
    placeholder?: string | undefined;
    saveOnChange?: boolean | undefined;
} & import("react").RefAttributes<IEditorRef<number>>>;
