import type { IRange } from '../../interface';
import { SelectionRegionType } from '../../interface';
export declare class CombinedSelection {
    type: SelectionRegionType;
    ranges: IRange[];
    constructor(type?: SelectionRegionType, ranges?: IRange[]);
    get isColumnSelection(): boolean;
    get isRowSelection(): boolean;
    get isCellSelection(): boolean;
    get isNoneSelection(): boolean;
    reset(): CombinedSelection;
    set(type: SelectionRegionType, ranges: IRange[]): CombinedSelection;
    setRanges(ranges: IRange[]): CombinedSelection;
    private isOverlap;
    expand(range: IRange): CombinedSelection;
    merge(range: IRange): CombinedSelection;
    flatten(): number[];
    serialize(): IRange[];
    includes(range?: IRange): boolean;
    equals(comparisonRanges: IRange[]): boolean;
}
export declare const emptySelection: CombinedSelection;
