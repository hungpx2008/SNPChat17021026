import type { IDatetimeFormatting } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellDate extends ICellValue<string> {
    formatting?: IDatetimeFormatting | null;
}
export declare const CellDate: (props: ICellDate) => import("react/jsx-runtime").JSX.Element;
export {};
