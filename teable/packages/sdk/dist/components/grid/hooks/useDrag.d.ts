/// <reference types="react" />
import type { IDragState, IMouseState, IRange, IScrollState } from '../interface';
import { DragRegionType, DraggableType } from '../interface';
import type { CoordinateManager, CombinedSelection } from '../managers';
export declare const getDropTargetIndex: (coordInstance: CoordinateManager, mouseState: IMouseState, scrollState: IScrollState, dragType: DragRegionType) => number;
export declare const useDrag: (coordInstance: CoordinateManager, scrollState: IScrollState, selection: CombinedSelection, draggable?: DraggableType) => {
    dragState: IDragState;
    setDragState: import("react").Dispatch<import("react").SetStateAction<IDragState>>;
    onDragStart: (mouseState: IMouseState, onEnd: (type: DragRegionType, dragIndexs: IRange[]) => void) => void;
    onDragChange: (mouseState: IMouseState) => void;
    onDragEnd: (mouseState: IMouseState, onEnd: (dragIndexs: IRange[], dropIndex: number) => void) => void;
};
