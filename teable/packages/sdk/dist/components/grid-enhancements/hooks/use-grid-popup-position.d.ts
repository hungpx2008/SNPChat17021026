import type { IEditorProps } from '../../grid/components';
export declare const useGridPopupPosition: (rect: IEditorProps['rect'], maxHeight?: number) => {
    top: string | number;
    bottom: string | number;
    maxHeight: number;
} | undefined;
