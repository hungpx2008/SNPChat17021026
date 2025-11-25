import type { IGridColumn } from '../../grid/interface';
import type { ICell } from '../../grid/renderers';
export declare const useGridGroupCollection: () => {
    groupColumns: IGridColumn[];
    getGroupCell: (_cellValue: unknown, depth: number) => ICell;
};
