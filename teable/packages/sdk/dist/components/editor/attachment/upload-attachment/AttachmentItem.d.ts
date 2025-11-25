import type { IAttachmentItem } from '@teable/core';
interface IUploadAttachment {
    attachment: IAttachmentItem;
    readonly?: boolean;
    onDelete: (id: string) => void;
    fileCover: (data: IAttachmentItem) => string;
    downloadFile: (data: IAttachmentItem) => void;
}
declare function AttachmentItem(props: IUploadAttachment): import("react/jsx-runtime").JSX.Element;
export default AttachmentItem;
