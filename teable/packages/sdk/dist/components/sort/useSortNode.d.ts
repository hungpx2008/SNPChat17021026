/// <reference types="react" />
import type { ISort } from '@teable/core';
export declare const useSortNode: (value?: ISort | null) => {
    text: string;
    isActive: boolean;
    Icon: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
};
