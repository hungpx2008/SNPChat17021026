import type { Colors, ISelectFieldOptions } from '@teable/core';
import type { ICellValue } from '../type';
export declare const getColorPairs: (color: Colors) => {
    color: "#fff" | "#000";
    backgroundColor: string;
};
export declare const transformSelectOptions: (choices: ISelectFieldOptions['choices']) => {
    color: "#fff" | "#000";
    backgroundColor: string;
    label: string;
    value: string;
}[];
export interface ISelectOption {
    label: string;
    value: string;
    color?: string;
    backgroundColor?: string;
}
interface ICellSelect extends ICellValue<string | string[]> {
    options?: ISelectOption[] | null;
    ellipsis?: boolean;
    itemClassName?: string;
}
export declare const CellSelect: (props: ICellSelect) => import("react/jsx-runtime").JSX.Element;
export {};
