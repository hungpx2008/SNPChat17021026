import { RegionType } from '../interface';
import type { IActiveCellBound, ICellItem, IRectangle, IRegionPosition, IRowControlItem } from '../interface';
import type { IRenderLayerProps } from '../RenderLayer';
interface ICheckRegionProps extends Pick<IRenderLayerProps, 'theme' | 'height' | 'columns' | 'scrollState' | 'dragState' | 'selection' | 'isSelecting' | 'columnResizeState' | 'coordInstance' | 'columnStatistics' | 'isMultiSelectionEnable' | 'getLinearRow'> {
    rowControls: IRowControlItem[];
    position: IRegionPosition;
    isFreezing: boolean;
    isOutOfBounds: boolean;
    isColumnFreezable: boolean;
    isColumnResizable: boolean;
    isColumnAppendEnable: boolean;
    isColumnHeaderMenuVisible: boolean;
    activeCell: ICellItem | null;
    activeCellBound: IActiveCellBound | null;
    real2RowIndex: (index: number) => number;
}
export interface IRegionData extends IRectangle {
    type: RegionType;
    rowIndex?: number;
    columnIndex?: number;
    isOutOfBounds?: boolean;
}
export declare const BLANK_REGION_DATA: {
    type: RegionType;
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const getRegionData: (props: ICheckRegionProps) => IRegionData;
export declare const getColumnStatisticData: (props: Pick<IRenderLayerProps, 'height' | 'scrollState' | 'coordInstance' | 'columnStatistics' | 'getLinearRow'> & {
    position: IRegionPosition;
}) => {
    type: RegionType;
    x: number;
    y: number;
    width: number;
    height: number;
} | null;
export {};
