/// <reference types="react" />
import type { IEditorContainerProps, IEditorRef } from '../components';
interface ISelectionKeyboardProps extends Omit<IEditorContainerProps, 'theme' | 'onChange' | 'scrollState' | 'activeCellBound' | 'real2RowIndex' | 'getCellContent' | 'onCellActivated'> {
    editorRef: React.MutableRefObject<IEditorRef | null>;
}
export declare const useKeyboardSelection: (props: ISelectionKeyboardProps) => void;
export {};
