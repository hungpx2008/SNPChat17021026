import type { ICellItem, IRectangle } from '../../interface';
export interface IGlobalImageManager {
    setWindow(newWindow: IRectangle, freezeCols: number): void;
    loadOrGetImage(url: string, col: number, row: number): HTMLImageElement | ImageBitmap | undefined;
    setCallback(imageLoaded: (locations: ICellItem[]) => void): void;
}
export declare class ImageManager implements IGlobalImageManager {
    private imageLoaded;
    private loadedLocations;
    private visibleWindow;
    private freezeColumnCount;
    private isInWindow;
    private cache;
    setCallback(imageLoaded: (locations: ICellItem[]) => void): void;
    private sendLoaded;
    private clearOutOfWindow;
    setWindow(newWindow: IRectangle, freezeColumnCount: number): void;
    private loadImage;
    loadOrGetImage(url: string, col: number, row: number): HTMLImageElement | ImageBitmap | undefined;
}
