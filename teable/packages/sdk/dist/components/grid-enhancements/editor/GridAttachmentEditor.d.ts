/// <reference types="react" />
import type { IEditorProps } from '../../grid/components';
import type { IWrapperEditorProps } from './type';
interface IGridAttachmentEditorRef {
    openFilePreview?: (activeId?: string) => void;
}
export declare const GridAttachmentEditor: import("react").ForwardRefExoticComponent<IWrapperEditorProps & IEditorProps<import("../..").IInnerCell> & import("react").RefAttributes<IGridAttachmentEditorRef>>;
export {};
