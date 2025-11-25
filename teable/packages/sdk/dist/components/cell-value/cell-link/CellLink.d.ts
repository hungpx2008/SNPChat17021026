import type { ILinkCellValue } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellLink extends ICellValue<ILinkCellValue | ILinkCellValue[]> {
    itemClassName?: string;
}
export declare const CellLink: (props: ICellLink) => import("react/jsx-runtime").JSX.Element;
export {};
