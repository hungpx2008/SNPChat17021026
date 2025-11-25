import type { FC } from 'react';
import type { IVisibleRegion } from './hooks';
import type { IInteractionLayerProps } from './InteractionLayer';
import type { ILinearRow, ICellItem, IDragState, IMouseState, IColumnResizeState, ICellPosition, IActiveCellBound, IColumnFreezeState } from './interface';
import type { CombinedSelection } from './managers';
export interface IRenderLayerProps extends Pick<IInteractionLayerProps, 'theme' | 'width' | 'height' | 'columns' | 'commentCountMap' | 'rowControls' | 'imageManager' | 'spriteManager' | 'scrollState' | 'coordInstance' | 'columnStatistics' | 'groupCollection' | 'rowIndexVisible' | 'searchCursor' | 'searchHitIndex' | 'collaborators' | 'columnHeaderHeight' | 'isMultiSelectionEnable' | 'getCellContent'> {
    isEditing?: boolean;
    visibleRegion: IVisibleRegion;
    activeCell: ICellItem | null;
    activeCellBound: IActiveCellBound | null;
    dragState: IDragState;
    mouseState: IMouseState;
    columnFreezeState: IColumnFreezeState;
    selection: CombinedSelection;
    isSelecting: boolean;
    isInteracting?: boolean;
    forceRenderFlag: string;
    hoverCellPosition: ICellPosition | null;
    hoveredColumnResizeIndex: number;
    columnResizeState: IColumnResizeState;
    isColumnFreezable?: boolean;
    isRowAppendEnable?: boolean;
    isColumnResizable?: boolean;
    isColumnAppendEnable?: boolean;
    isColumnHeaderMenuVisible?: boolean;
    real2RowIndex: (index: number) => number;
    getLinearRow: (index: number) => ILinearRow;
}
export declare const RenderLayer: FC<React.PropsWithChildren<IRenderLayerProps>>;
