/// <reference types="react" />
import type { IRectangle } from '../../../grid/interface';
export interface ITooltipInfo {
    id?: string;
    text: string;
    position: IRectangle;
    triggerClassName?: string;
    contentClassName?: string;
    triggerStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}
interface IGridTooltipState {
    tooltipInfo?: ITooltipInfo;
    openTooltip: (props: ITooltipInfo) => void;
    closeTooltip: () => void;
}
export declare const useGridTooltipStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IGridTooltipState>>;
export {};
