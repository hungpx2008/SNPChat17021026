/// <reference types="react" />
import type { EditorSelection, Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
interface ICodeEditorProps {
    value?: string;
    extensions?: Extension[];
    onChange?: (value: string) => void;
    onSelectionChange?: (value: string, selection: EditorSelection) => void;
    placeholder?: string;
}
export interface ICodeEditorRef {
    getEditorView: () => EditorView | null;
}
export declare const CodeEditor: import("react").ForwardRefExoticComponent<ICodeEditorProps & import("react").RefAttributes<ICodeEditorRef>>;
export {};
