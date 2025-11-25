import type { ICellItem, IColumnLoading, IScrollState } from '../interface';
import type { CoordinateManager } from '../managers';
export interface ILoadingIndicatorProps {
    cellLoadings: ICellItem[];
    columnLoadings: IColumnLoading[];
    coordInstance: CoordinateManager;
    scrollState: IScrollState;
}
export declare const LoadingIndicator: (props: ILoadingIndicatorProps) => import("react/jsx-runtime").JSX.Element | null;
