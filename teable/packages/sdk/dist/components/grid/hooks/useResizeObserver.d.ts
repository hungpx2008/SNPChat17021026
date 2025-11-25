import type { MutableRefObject } from 'react';
interface IResizeDetectorDimensions {
    width: number;
    height: number;
}
export interface IUseResizeDetectorReturn<T> extends IResizeDetectorDimensions {
    ref: MutableRefObject<T | null>;
}
export declare function useResizeObserver<T extends HTMLElement = HTMLElement>(initialSize?: readonly [width: number, height: number]): IUseResizeDetectorReturn<T>;
export {};
