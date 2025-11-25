import type { Dispatch, ForwardRefRenderFunction, SetStateAction } from 'react';
import type { IGridTheme } from './configs';
import type { IGridProps } from './Grid';
import type { IActiveCellBound, ICellItem, ILinearRow, IMouseState, IRowControlItem, IScrollState } from './interface';
import type { CoordinateManager, ImageManager, SpriteManager, CombinedSelection } from './managers';
export interface IInteractionLayerProps extends Omit<IGridProps, 'freezeColumnCount' | 'rowCount' | 'rowHeight' | 'style' | 'smoothScrollX' | 'smoothScrollY' | 'onVisibleRegionChanged'> {
    theme: IGridTheme;
    width: number;
    height: number;
    forceRenderFlag: string;
    rowControls: IRowControlItem[];
    mouseState: IMouseState;
    scrollState: IScrollState;
    imageManager: ImageManager;
    spriteManager: SpriteManager;
    coordInstance: CoordinateManager;
    activeCell: ICellItem | null;
    activeCellBound: IActiveCellBound | null;
    real2RowIndex: (index: number) => number;
    getLinearRow: (index: number) => ILinearRow;
    setActiveCell: Dispatch<SetStateAction<ICellItem | null>>;
    setMouseState: Dispatch<SetStateAction<IMouseState>>;
    scrollBy: (deltaX: number, deltaY: number) => void;
    scrollToItem: (position: [columnIndex: number, rowIndex: number]) => void;
}
export interface IInteractionLayerRef {
    isEditing: () => boolean;
    resetState: () => void;
    setSelection: (selection: CombinedSelection) => void;
}
export declare const InteractionLayerBase: ForwardRefRenderFunction<IInteractionLayerRef, IInteractionLayerProps>;
export declare const InteractionLayer: import("react").ForwardRefExoticComponent<IInteractionLayerProps & import("react").RefAttributes<IInteractionLayerRef>>;
