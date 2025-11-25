/// <reference types="react" />
import type { ICellEditor, IEditorRef } from '../type';
type ITextEditor = ICellEditor<string | null>;
export declare const LongTextEditor: import("react").ForwardRefExoticComponent<ITextEditor & import("react").RefAttributes<IEditorRef<string>>>;
export {};
