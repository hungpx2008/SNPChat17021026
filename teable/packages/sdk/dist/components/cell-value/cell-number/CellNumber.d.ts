import type { INumberFormatting } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellNumber extends ICellValue<number | number[]> {
    formatting?: INumberFormatting;
}
export declare const CellNumber: (props: ICellNumber) => import("react/jsx-runtime").JSX.Element;
export {};
