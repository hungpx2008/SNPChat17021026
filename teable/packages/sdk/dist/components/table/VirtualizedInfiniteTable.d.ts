import type { ColumnDef } from '@tanstack/react-table';
export interface IVirtualizedInfiniteTableProps<T> {
    rows: T[];
    columns: ColumnDef<T>[];
    className?: string;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
}
export declare const VirtualizedInfiniteTable: <T extends {
    [key: string]: unknown;
}>(props: IVirtualizedInfiniteTableProps<T>) => import("react/jsx-runtime").JSX.Element;
