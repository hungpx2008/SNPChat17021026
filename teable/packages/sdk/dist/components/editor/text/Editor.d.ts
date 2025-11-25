/// <reference types="react" />
import type { ISingleLineTextFieldOptions } from '@teable/core';
import type { ICellEditor, IEditorRef } from '../type';
interface ITextEditor extends ICellEditor<string | null> {
    options: ISingleLineTextFieldOptions;
}
export declare const TextEditor: import("react").ForwardRefExoticComponent<ITextEditor & import("react").RefAttributes<IEditorRef<string>>>;
export {};
