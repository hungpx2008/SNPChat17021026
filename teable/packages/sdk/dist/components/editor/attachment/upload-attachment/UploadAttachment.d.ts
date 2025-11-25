import type { IAttachmentCellValue } from '@teable/core';
import { AttachmentManager } from './uploadManage';
export interface IUploadAttachment {
    className?: string;
    attachments: IAttachmentCellValue;
    attachmentManager?: AttachmentManager;
    onChange?: (attachment: IAttachmentCellValue | null) => void;
    readonly?: boolean;
}
export declare const UploadAttachment: (props: IUploadAttachment) => import("react/jsx-runtime").JSX.Element;
