import type { IPosition } from '../interface';
import { DragRegionType } from '../interface';
import type { CoordinateManager } from '../managers';
interface IUseAutoScroll {
    coordInstance: CoordinateManager;
    scrollBy: (deltaX: number, deltaY: number) => void;
}
export declare const useAutoScroll: (props: IUseAutoScroll) => {
    onAutoScroll: <T extends IPosition>(position: T, dragType?: DragRegionType) => void;
    onAutoScrollStop: () => void;
};
export {};
