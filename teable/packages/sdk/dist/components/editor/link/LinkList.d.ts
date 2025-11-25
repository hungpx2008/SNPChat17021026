/// <reference types="react" />
import type { ILinkCellValue } from '@teable/core';
import type { IGetRecordsRo } from '@teable/openapi';
import { CombinedSelection } from '../../grid';
import { LinkListType } from './interface';
interface ILinkListProps {
    type?: LinkListType;
    rowCount: number;
    hiddenFieldIds?: string[];
    readonly?: boolean;
    isMultiple?: boolean;
    recordQuery?: IGetRecordsRo;
    cellValue?: ILinkCellValue | ILinkCellValue[];
    onChange?: (value?: ILinkCellValue[]) => void;
    onExpand?: (recordId: string) => void;
}
export interface ILinkListRef {
    onReset: () => void;
    onForceUpdate: () => void;
    setSelection: (selection: CombinedSelection) => void;
    scrollToItem: (position: [columnIndex: number, rowIndex: number]) => void;
}
export declare const LinkList: import("react").ForwardRefExoticComponent<ILinkListProps & import("react").RefAttributes<ILinkListRef>>;
export {};
