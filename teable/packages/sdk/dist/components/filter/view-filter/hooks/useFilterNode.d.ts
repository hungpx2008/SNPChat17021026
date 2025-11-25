/// <reference types="react" />
import type { IFilter } from '@teable/core';
import type { IFieldInstance } from '../../../../model';
export declare const useFilterNode: (filters: IFilter | null | undefined, fields: IFieldInstance[]) => {
    text: string;
    isActive: boolean;
    Icon: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
};
