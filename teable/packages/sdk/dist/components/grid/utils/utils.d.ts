export type ITimeoutID = {
    id: number;
};
export declare const cancelTimeout: (timeoutID: ITimeoutID) => void;
export declare const requestTimeout: (callback: () => void, delay: number) => ITimeoutID;
export declare const getWheelDelta: ({ event, pageHeight, lineHeight, }: {
    event: WheelEvent;
    pageHeight?: number | undefined;
    lineHeight?: number | undefined;
}) => number[];
export declare const hexToRGBA: (hex: string, alpha?: number) => string;
export declare const parseToRGB: (hex: string) => number[];
