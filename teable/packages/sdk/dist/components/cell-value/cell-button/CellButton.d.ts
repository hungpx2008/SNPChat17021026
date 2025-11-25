import type { IButtonFieldCellValue, IButtonFieldOptions } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellButton extends ICellValue<IButtonFieldCellValue> {
    options: IButtonFieldOptions;
    itemClassName?: string;
    readonly?: boolean;
    isLookup?: boolean;
}
export declare const CellButton: (props: ICellButton) => import("react/jsx-runtime").JSX.Element;
export {};
