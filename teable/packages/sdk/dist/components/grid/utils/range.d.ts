import type { ICellItem, IRange } from '../interface';
import type { CombinedSelection } from '../managers';
export declare const isRangeWithinRanges: (checkedRange: IRange, ranges: IRange[]) => boolean;
export declare const flatRanges: (ranges: IRange[]) => number[];
export declare const isPointInsideRectangle: (checkPoint: [number, number], startPoint: [number, number], endPoint: [number, number]) => boolean;
export declare const inRange: (num: number, start: number, end: number) => boolean;
export declare const serializedRanges: (ranges: IRange[]) => IRange[];
export declare const mixRanges: (ranges: IRange[], newRange: IRange) => IRange[];
export declare const calculateMaxRange: (selection: CombinedSelection) => number[] | null;
export declare const checkIfRowOrCellActive: (activeCell: ICellItem | null, rowIndex: number, columnIndex: number) => {
    isRowActive: boolean;
    isCellActive: boolean;
};
export declare const checkIfRowOrCellSelected: (selection: CombinedSelection, rowIndex: number, columnIndex: number) => {
    isRowSelected: boolean;
    isCellSelected: boolean;
};
