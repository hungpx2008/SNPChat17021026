/// <reference types="react" />
import type { IGridRef } from '../../grid/Grid';
import type { ICellItem } from '../../grid/interface';
interface IUseGridFileEventProps {
    gridRef: React.RefObject<IGridRef>;
    onValidation: (cell: ICellItem) => boolean;
    onCellDrop: (cell: ICellItem, files: FileList) => Promise<void> | void;
}
export declare const useGridFileEvent: (props: IUseGridFileEventProps) => {
    onDragOver: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
};
export {};
