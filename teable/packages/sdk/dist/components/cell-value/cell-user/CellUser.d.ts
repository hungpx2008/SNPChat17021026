import type { IUserCellValue } from '@teable/core';
import type { ICellValue } from '../type';
interface ICellUser extends ICellValue<IUserCellValue | IUserCellValue[]> {
    itemClassName?: string;
    formatImageUrl?: (url: string) => string;
}
export declare const CellUser: (props: ICellUser) => import("react/jsx-runtime").JSX.Element;
export {};
