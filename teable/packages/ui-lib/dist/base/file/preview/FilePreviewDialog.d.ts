/// <reference types="react" />
import type { IFileId, IFileItem } from './FilePreviewContext';
export interface IFilePreviewDialogRef {
    openPreview: (activeId?: IFileId) => void;
    closePreview: () => void;
}
interface IFilePreviewDialogProps {
    files: IFileItem[];
}
export declare const FilePreviewDialog: import("react").ForwardRefExoticComponent<IFilePreviewDialogProps & import("react").RefAttributes<IFilePreviewDialogRef>>;
export {};
