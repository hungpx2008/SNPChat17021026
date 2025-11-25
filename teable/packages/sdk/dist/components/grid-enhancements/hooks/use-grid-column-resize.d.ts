import type { IGridColumn } from '../..';
export declare function useGridColumnResize<T extends {
    id: string;
}>(_columns: T[]): {
    columns: T[];
    onColumnResize: (column: IGridColumn, newSize: number, colIndex: number) => void;
};
