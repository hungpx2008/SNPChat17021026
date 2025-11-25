import type { ISort } from '@teable/core';
import React from 'react';
interface ISortBaseProps {
    sorts: ISort | null;
    manualSortLoading?: boolean;
    onChange: (sort: ISort | null) => void;
    manualSortOnClick?: () => void;
    hiddenManual?: boolean;
    children: React.ReactNode;
}
export interface ISortBaseRef {
    close: () => void;
}
export declare const SortBase: React.ForwardRefExoticComponent<ISortBaseProps & React.RefAttributes<ISortBaseRef>>;
export {};
