import type { ISort } from '@teable/core';
interface IDraggableSortProps {
    sorts: NonNullable<ISort>['sortObjs'];
    selectedFields: string[];
    onChange: (sorts: NonNullable<ISort>['sortObjs']) => void;
}
declare function DraggableSortList(props: IDraggableSortProps): import("react/jsx-runtime").JSX.Element;
export { DraggableSortList };
