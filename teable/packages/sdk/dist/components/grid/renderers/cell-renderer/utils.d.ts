import type { IActiveCellBound } from '../../interface';
export declare const getCellScrollState: (activeCellBound: IActiveCellBound) => {
    scrollBarHeight: number;
    scrollBarScrollTop: number;
    contentScrollTop: number;
};
