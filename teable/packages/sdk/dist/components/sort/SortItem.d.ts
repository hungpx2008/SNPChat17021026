import { type ISortItem } from '@teable/core';
export interface ISortItemProps {
    index: number;
    value: ISortItem;
    selectedFields?: string[];
    onSelect: (index: number, item: ISortItem) => void;
}
declare function SortItem(props: ISortItemProps): import("react/jsx-runtime").JSX.Element;
export { SortItem };
