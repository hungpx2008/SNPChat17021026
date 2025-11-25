import type { IAttachmentCellValue } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellAttachment extends ICellValue<IAttachmentCellValue> {
    itemClassName?: string;
    formatImageUrl?: (url: string) => string;
}
export declare const CellAttachment: (props: ICellAttachment) => import("react/jsx-runtime").JSX.Element;
export {};
