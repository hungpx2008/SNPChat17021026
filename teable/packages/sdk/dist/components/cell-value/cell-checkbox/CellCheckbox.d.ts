import type { ICellValue } from '../type';
interface ICellCheckbox extends ICellValue<boolean | boolean[]> {
    itemClassName?: string;
}
export declare const CellCheckbox: (props: ICellCheckbox) => import("react/jsx-runtime").JSX.Element;
export {};
