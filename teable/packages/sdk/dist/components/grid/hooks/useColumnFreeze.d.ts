import type { IScrollState, IColumnFreezeState, IMouseState } from '../interface';
import type { CoordinateManager } from '../managers';
export declare const useColumnFreeze: (coordInstance: CoordinateManager, scrollState: IScrollState) => {
    columnFreezeState: IColumnFreezeState;
    onColumnFreezeStart: (mouseState: IMouseState) => void;
    onColumnFreezeMove: (mouseState: IMouseState) => void;
    onColumnFreezeEnd: (callbackFn?: ((columnCount: number) => void) | undefined) => void;
};
