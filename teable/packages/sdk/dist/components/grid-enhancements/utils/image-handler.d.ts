interface NextImageOptimizationParams {
    url: string;
    w: number;
    q: number;
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    format?: 'webp' | 'png' | 'jpg';
}
export declare const convertNextImageUrl: (params: NextImageOptimizationParams) => string;
export declare const findClosestWidth: (width: number, height: number) => number;
export {};
