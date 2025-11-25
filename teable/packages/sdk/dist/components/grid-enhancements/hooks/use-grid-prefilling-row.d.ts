/// <reference types="react" />
import type { ICell, ICellItem, IGridColumn, IInnerCell } from '../../grid/interface';
export declare const useGridPrefillingRow: (columns: (IGridColumn & {
    id: string;
})[]) => {
    localRecord: import("../../../model").Record | null;
    prefillingRowIndex: number | undefined;
    prefillingRowOrder: {
        anchorId: string;
        position: "before" | "after";
    } | undefined;
    prefillingFieldValueMap: {
        [fieldId: string]: unknown;
    } | undefined;
    setPrefillingRowIndex: import("react").Dispatch<import("react").SetStateAction<number | undefined>>;
    setPrefillingRowOrder: import("react").Dispatch<import("react").SetStateAction<{
        anchorId: string;
        position: "before" | "after";
    } | undefined>>;
    onPrefillingCellEdited: (cell: ICellItem, newVal: IInnerCell) => import("../../../model").Record | undefined;
    getPrefillingCellContent: (cell: ICellItem) => ICell;
    setPrefillingFieldValueMap: import("react").Dispatch<import("react").SetStateAction<{
        [fieldId: string]: unknown;
    } | undefined>>;
};
