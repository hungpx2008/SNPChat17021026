import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import type { ILinkCellValue } from '@teable/core';
interface IApiRecordListProps {
    queryKey: QueryKey;
    queryFn: QueryFunction<{
        id: string;
        title?: string;
    }[]>;
    selectedRecordIds?: string[];
    pageSize: number;
    onSearch?: (search?: string) => void;
    onClick?: (record: ILinkCellValue) => void;
    onSelected?: (record: ILinkCellValue) => void;
}
export declare const ApiRecordList: (props: IApiRecordListProps) => import("react/jsx-runtime").JSX.Element;
export {};
