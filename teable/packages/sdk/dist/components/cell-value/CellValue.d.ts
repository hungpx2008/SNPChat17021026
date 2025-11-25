import type { IFieldInstance } from '../../model';
import type { ICellValue } from './type';
interface ICellValueContainer extends ICellValue<unknown> {
    field: IFieldInstance;
    formatImageUrl?: (url: string) => string;
    itemClassName?: string;
    readonly?: boolean;
}
export declare const CellValue: (props: ICellValueContainer) => import("react/jsx-runtime").JSX.Element;
export {};
