import type { IScrollState } from '../interface';
import type { CoordinateManager } from '../managers';
export interface IVisibleRegion {
    startRowIndex: number;
    stopRowIndex: number;
    startColumnIndex: number;
    stopColumnIndex: number;
}
export declare const getVerticalRangeInfo: (coordInstance: CoordinateManager, scrollTop: number) => {
    startRowIndex: number;
    stopRowIndex: number;
};
export declare const getHorizontalRangeInfo: (coordInstance: CoordinateManager, scrollLeft: number) => {
    startColumnIndex: number;
    stopColumnIndex: number;
};
export declare const useVisibleRegion: (coordInstance: CoordinateManager, scrollState: IScrollState, forceRenderFlag: string) => {
    startRowIndex: number;
    stopRowIndex: number;
    startColumnIndex: number;
    stopColumnIndex: number;
};
