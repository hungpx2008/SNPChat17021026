import type { ISort } from '@teable/core';
import React from 'react';
interface ISortProps {
    children: (text: string, isActive: boolean) => React.ReactElement;
    sorts: ISort | null;
    onChange: (sort: ISort | null) => void;
}
declare function Sort(props: ISortProps): import("react/jsx-runtime").JSX.Element;
export { Sort };
