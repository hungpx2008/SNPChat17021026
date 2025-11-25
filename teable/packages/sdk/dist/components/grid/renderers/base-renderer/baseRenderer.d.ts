import type { ILineProps, IMultiLineTextProps, IRectProps, IRoundPolyProps, ISingleLineTextProps, ICheckboxProps, IRingProps, IProcessBarProps, IChartLineProps, IChartBarProps, ITextInfo, IAvatarProps } from './interface';
export declare const drawMultiLineText: (ctx: CanvasRenderingContext2D, props: IMultiLineTextProps) => ITextInfo[];
export declare const drawSingleLineText: (ctx: CanvasRenderingContext2D, props: ISingleLineTextProps) => {
    text: string;
    width: number;
};
export declare const drawLine: (ctx: CanvasRenderingContext2D, props: ILineProps) => void;
export declare const drawRect: (ctx: CanvasRenderingContext2D, props: IRectProps) => void;
export declare const drawRoundPoly: (ctx: CanvasRenderingContext2D, props: IRoundPolyProps) => void;
export declare const drawCheckbox: (ctx: CanvasRenderingContext2D, props: ICheckboxProps) => void;
export declare const drawRing: (ctx: CanvasRenderingContext2D, props: IRingProps) => void;
export declare const drawProcessBar: (ctx: CanvasRenderingContext2D, props: IProcessBarProps) => void;
export declare const drawChartLine: (ctx: CanvasRenderingContext2D, props: IChartLineProps) => void;
export declare const drawChartBar: (ctx: CanvasRenderingContext2D, props: IChartBarProps) => void;
export declare const drawAvatar: (ctx: CanvasRenderingContext2D, props: IAvatarProps) => void;
