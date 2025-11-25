import type { Dispatch, FC, SetStateAction } from 'react';
import { type IGridTheme } from './configs';
import type { IGridProps } from './Grid';
import type { ICellItem, ILinearRow, IMouseState, IRowControlItem, IScrollState } from './interface';
import type { CoordinateManager, ImageManager, SpriteManager } from './managers';
export interface ITouchLayerProps extends Omit<IGridProps, 'style' | 'rowCount' | 'rowHeight' | 'smoothScrollX' | 'smoothScrollY' | 'freezeColumnCount' | 'onCopy' | 'onPaste' | 'onRowOrdered' | 'onColumnResize' | 'onColumnOrdered' | 'onColumnHeaderDblClick' | 'onColumnHeaderMenuClick' | 'onVisibleRegionChanged'> {
    theme: IGridTheme;
    width: number;
    height: number;
    forceRenderFlag: string;
    mouseState: IMouseState;
    scrollState: IScrollState;
    imageManager: ImageManager;
    spriteManager: SpriteManager;
    coordInstance: CoordinateManager;
    rowControls: IRowControlItem[];
    real2RowIndex: (index: number) => number;
    getLinearRow: (index: number) => ILinearRow;
    setMouseState: Dispatch<SetStateAction<IMouseState>>;
    setActiveCell: Dispatch<SetStateAction<ICellItem | null>>;
}
export declare const TouchLayer: FC<ITouchLayerProps>;
