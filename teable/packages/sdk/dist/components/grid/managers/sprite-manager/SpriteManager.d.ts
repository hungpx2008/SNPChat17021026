import type { IGridTheme } from '../../configs';
import type { GridInnerIcon, ISpriteProps } from './sprites';
export type ISprite = (props: ISpriteProps) => string;
export type ISpriteMap = Record<string | GridInnerIcon, ISprite>;
export type ISpriteVariant = 'normal' | 'selected';
interface ISpriteDrawerProps {
    x: number;
    y: number;
    sprite: GridInnerIcon | string;
    size: number;
    theme: IGridTheme;
    colors?: [fgColor: string, bgColor: string];
    variant?: ISpriteVariant;
    alpha?: number;
}
export declare class SpriteManager {
    private onSettled?;
    private spriteMap;
    private icons;
    private inFlight;
    constructor(icons?: ISpriteMap, onSettled?: (() => void) | undefined);
    drawSprite(ctx: CanvasRenderingContext2D, props: ISpriteDrawerProps): void;
}
export {};
