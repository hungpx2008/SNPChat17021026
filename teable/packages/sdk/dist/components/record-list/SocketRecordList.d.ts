import type { ILinkCellValue } from '@teable/core';
interface ISocketRecordListProps {
    lookupFieldId: string;
    take?: number;
    selectedRecordIds?: string[];
    onSelected?: (record: ILinkCellValue) => void;
    onClick?: (record: ILinkCellValue) => void;
}
export declare const SocketRecordList: (props: ISocketRecordListProps) => import("react/jsx-runtime").JSX.Element;
export {};
