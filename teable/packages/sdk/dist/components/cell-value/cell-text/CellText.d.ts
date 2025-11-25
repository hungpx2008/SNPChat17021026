import type { SingleLineTextDisplayType } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellText extends ICellValue<string> {
    displayType?: SingleLineTextDisplayType;
}
export declare const CellText: (props: ICellText) => import("react/jsx-runtime").JSX.Element;
export {};
