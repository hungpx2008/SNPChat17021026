import type { CSSProperties, ForwardRefRenderFunction } from 'react';
import type { IGridTheme } from '../../configs';
import type { IInteractionLayerProps } from '../../InteractionLayer';
import { type IActiveCellBound, type ICellItem, type IRectangle, type IScrollState } from '../../interface';
import type { CombinedSelection } from '../../managers';
import type { IInnerCell } from '../../renderers/cell-renderer/interface';
export interface IEditorContainerProps extends Pick<IInteractionLayerProps, 'theme' | 'coordInstance' | 'scrollToItem' | 'real2RowIndex' | 'getCellContent' | 'onUndo' | 'onRedo' | 'onCopy' | 'onPaste' | 'onDelete' | 'onRowAppend' | 'onRowExpand' | 'scrollBy'> {
    isEditing?: boolean;
    scrollState: IScrollState;
    activeCell: ICellItem | null;
    selection: CombinedSelection;
    activeCellBound: IActiveCellBound | null;
    setActiveCell: React.Dispatch<React.SetStateAction<ICellItem | null>>;
    setSelection: React.Dispatch<React.SetStateAction<CombinedSelection>>;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    onChange?: (cell: ICellItem, cellValue: IInnerCell) => void;
}
export interface IEditorRef<T extends IInnerCell = IInnerCell> {
    focus?: () => void;
    setValue?: (data: T['data']) => void;
    saveValue?: () => void;
}
export interface IEditorProps<T extends IInnerCell = IInnerCell> {
    cell: T;
    rect: IRectangle & {
        editorId: string;
    };
    theme: IGridTheme;
    style?: CSSProperties;
    isEditing?: boolean;
    initialSearch?: string;
    setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
    onChange?: (value: unknown) => void;
}
export interface IEditorContainerRef {
    focus?: () => void;
    saveValue?: () => void;
}
export declare const EditorContainerBase: ForwardRefRenderFunction<IEditorContainerRef, IEditorContainerProps>;
export declare const EditorContainer: import("react").ForwardRefExoticComponent<IEditorContainerProps & import("react").RefAttributes<IEditorContainerRef>>;
