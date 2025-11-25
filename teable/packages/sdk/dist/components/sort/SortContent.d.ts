import type { ISort } from '@teable/core';
interface ISortProps {
    sortValues?: NonNullable<ISort>['sortObjs'];
    limit?: number;
    addBtnText?: string;
    onChange: (sort?: NonNullable<ISort>['sortObjs']) => void;
}
export declare function SortContent(props: ISortProps): import("react/jsx-runtime").JSX.Element;
export {};
