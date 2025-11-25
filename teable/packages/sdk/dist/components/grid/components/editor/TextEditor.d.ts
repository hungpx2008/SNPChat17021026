/// <reference types="react" />
import type { ILinkCell, INumberCell, ITextCell } from '../../renderers';
import type { IEditorRef, IEditorProps } from './EditorContainer';
export declare const TextEditor: import("react").ForwardRefExoticComponent<IEditorProps<ITextCell | ILinkCell | INumberCell> & import("react").RefAttributes<IEditorRef<ITextCell | INumberCell>>>;
