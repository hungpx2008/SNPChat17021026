/// <reference types="react" />
import type { IGridProps } from '../Grid';
import type { ICellItem, ILinearRow, IMouseState, IPosition } from '../interface';
import { SelectableType } from '../interface';
import { CombinedSelection, type CoordinateManager } from '../managers';
interface IUseSelectionProps {
    coordInstance: CoordinateManager;
    selectable?: SelectableType;
    isMultiSelectionEnable?: boolean;
    getLinearRow: (index: number) => ILinearRow;
    onSelectionChanged: IGridProps['onSelectionChanged'];
    setActiveCell: React.Dispatch<React.SetStateAction<ICellItem | null>>;
}
export declare const useSelection: (props: IUseSelectionProps) => {
    selection: CombinedSelection;
    isSelecting: boolean;
    setActiveCell: import("react").Dispatch<import("react").SetStateAction<ICellItem | null>>;
    setSelection: import("react").Dispatch<import("react").SetStateAction<CombinedSelection>>;
    onSelectionStart: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, mouseState: IMouseState) => void;
    onSelectionChange: (mouseState: IMouseState) => void;
    onSelectionEnd: () => void;
    onSelectionClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, mouseState: IMouseState) => void;
    onSelectionContextMenu: (mouseState: IMouseState, callback: (selection: CombinedSelection, position: IPosition) => void) => void;
};
export {};
