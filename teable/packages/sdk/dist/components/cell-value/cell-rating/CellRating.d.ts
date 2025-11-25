/// <reference types="react" />
import type { IRatingFieldOptions } from '@teable/core';
import type { ICellValue } from '../type';
export declare const RATING_ICON_MAP: {
    star: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    moon: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    sun: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    zap: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    flame: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    heart: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    apple: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    "thumb-up": (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
};
interface ICellRating extends ICellValue<number> {
    options: IRatingFieldOptions;
    itemClassName?: string;
}
export declare const CellRating: (props: ICellRating) => import("react/jsx-runtime").JSX.Element;
export {};
