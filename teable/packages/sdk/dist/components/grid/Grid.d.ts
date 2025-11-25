import type { CSSProperties } from 'react';
import type { IGridTheme } from './configs';
import type { IRectangle, IScrollState, ICellItem, IGridColumn, IPosition, IRowControlItem, IColumnStatistics, ICollaborator, IGroupPoint, IGroupCollection, DragRegionType, IColumnLoading } from './interface';
import { RegionType, DraggableType, SelectableType } from './interface';
import type { ISpriteMap, CombinedSelection } from './managers';
import { type ICell, type IInnerCell } from './renderers';
export interface IGridExternalProps {
    theme?: Partial<IGridTheme>;
    customIcons?: ISpriteMap;
    rowControls?: IRowControlItem[];
    smoothScrollX?: boolean;
    smoothScrollY?: boolean;
    scrollBufferX?: number;
    scrollBufferY?: number;
    scrollBarVisible?: boolean;
    rowIndexVisible?: boolean;
    collaborators?: ICollaborator;
    searchCursor?: [number, number] | null;
    searchHitIndex?: {
        fieldId: string;
        recordId: string;
    }[];
    /**
     * Indicates which areas can be dragged, including rows, columns or no drag
     * - 'all': Allow drag of rows, columns and cells (default)
     * - 'none': Disable drag for all areas
     * - 'row': Allow row drag only
     * - 'column': Allow column drag only
     */
    draggable?: DraggableType;
    /**
     * Indicates which areas can be selected, including row selection,
     * column selection, cell selection, all areas, or no selection
     * - 'all': Allow selection of rows, columns and cells (default)
     * - 'none': Disable selection for all areas
     * - 'row': Allow row selection only
     * - 'column': Allow column selection only
     * - 'cell': Allow cell selection only
     */
    selectable?: SelectableType;
    /**
     * Whether to allow multiple selection operations, including rows, columns and cells
     * If true, allow multiple selection of rows/columns/cells (default)
     * If false, disable multiple selection operations
     * @type {boolean}
     */
    isMultiSelectionEnable?: boolean;
    groupCollection?: IGroupCollection | null;
    collapsedGroupIds?: Set<string> | null;
    groupPoints?: IGroupPoint[] | null;
    onUndo?: () => void;
    onRedo?: () => void;
    onCopy?: (selection: CombinedSelection, e: React.ClipboardEvent) => void;
    onPaste?: (selection: CombinedSelection, e: React.ClipboardEvent) => void;
    onDelete?: (selection: CombinedSelection) => void;
    onCellEdited?: (cell: ICellItem, newValue: IInnerCell) => void;
    onCellDblClick?: (cell: ICellItem) => void;
    onSelectionChanged?: (selection: CombinedSelection) => void;
    onVisibleRegionChanged?: (rect: IRectangle) => void;
    onCollapsedGroupChanged?: (collapsedGroupIds: Set<string>) => void;
    onColumnFreeze?: (freezeColumnCount: number) => void;
    onColumnAppend?: () => void;
    onRowExpand?: (rowIndex: number) => void;
    onRowAppend?: (targetIndex?: number) => void;
    onRowOrdered?: (dragRowIndexCollection: number[], dropRowIndex: number) => void;
    onColumnOrdered?: (dragColIndexCollection: number[], dropColIndex: number) => void;
    onColumnResize?: (column: IGridColumn, newSize: number, colIndex: number) => void;
    onColumnHeaderClick?: (colIndex: number, bounds: IRectangle) => void;
    onColumnHeaderDblClick?: (colIndex: number, bounds: IRectangle) => void;
    onColumnHeaderMenuClick?: (colIndex: number, bounds: IRectangle) => void;
    onColumnStatisticClick?: (colIndex: number, bounds: IRectangle) => void;
    onContextMenu?: (selection: CombinedSelection, position: IPosition) => void;
    onGroupHeaderContextMenu?: (groupId: string, position: IPosition) => void;
    onScrollChanged?: (scrollLeft: number, scrollTop: number) => void;
    onDragStart?: (type: DragRegionType, dragIndexs: number[]) => void;
    /**
     * Triggered when the mouse hovers over the every type of region
     */
    onItemHovered?: (type: RegionType, bounds: IRectangle, cellItem: ICellItem) => void;
    /**
     * Triggered when the mouse clicks the every type of region
     */
    onItemClick?: (type: RegionType, bounds: IRectangle, cellItem: ICellItem) => void;
}
export interface IGridProps extends IGridExternalProps {
    columns: IGridColumn[];
    commentCountMap?: Record<string, number>;
    freezeColumnCount?: number;
    rowCount: number;
    rowHeight?: number;
    style?: CSSProperties;
    isTouchDevice?: boolean;
    columnHeaderHeight?: number;
    columnStatistics?: IColumnStatistics;
    getCellContent: (cell: ICellItem) => ICell;
}
export interface IGridRef {
    resetState: () => void;
    forceUpdate: () => void;
    getActiveCell: () => ICellItem | null;
    getRowOffset: (rowIndex: number) => number;
    setSelection: (selection: CombinedSelection) => void;
    getScrollState: () => IScrollState;
    scrollBy: (deltaX: number, deltaY: number) => void;
    scrollTo: (scrollLeft?: number, scrollTop?: number) => void;
    scrollToItem: (position: [columnIndex: number, rowIndex: number]) => void;
    setActiveCell: (cell: ICellItem | null) => void;
    getCellIndicesAtPosition: (x: number, y: number) => ICellItem | null;
    getContainer: () => HTMLDivElement | null;
    getCellBounds: (cell: ICellItem) => IRectangle | null;
    setCellLoading: (cells: ICellItem[]) => void;
    setColumnLoadings: (columnLoadings: IColumnLoading[]) => void;
    isEditing: () => boolean | undefined;
}
export declare const Grid: import("react").ForwardRefExoticComponent<IGridProps & import("react").RefAttributes<IGridRef>>;
