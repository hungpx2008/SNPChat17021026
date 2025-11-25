import type { ColumnDef } from '@tanstack/react-table';
interface IInfiniteTableProps<T> {
    rows: T[];
    columns: ColumnDef<T>[];
    className?: string;
    fetchNextPage?: () => void;
}
export declare const InfiniteTable: <T extends {
    [key: string]: unknown;
}>(props: IInfiniteTableProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
