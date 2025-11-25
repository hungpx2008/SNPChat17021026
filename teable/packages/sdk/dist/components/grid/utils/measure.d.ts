export interface IAutoSize {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    lineHeight?: number;
}
export declare const MeasuredCanvas: (defaults?: IAutoSize) => {
    ctx: CanvasRenderingContext2D | null;
    reset: () => void;
    setFontSize: (fontSize: number) => void;
} | undefined;
export declare const measuredCanvas: {
    ctx: CanvasRenderingContext2D | null;
    reset: () => void;
    setFontSize: (fontSize: number) => void;
} | undefined;
