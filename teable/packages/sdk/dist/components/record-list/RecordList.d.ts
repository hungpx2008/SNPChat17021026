import React from 'react';
interface IRecordListProps {
    empty?: string | React.ReactNode;
    className?: string;
    itemClassName?: string;
    rowCount: number;
    isLoading?: boolean;
    itemHeight?: number;
    children?: React.ReactNode;
    itemRender: (index: number) => React.ReactNode;
    onSelect?: (index: number) => void;
    onVisibleChange?: (range: [number, number]) => void;
}
export declare const RecordList: (props: IRecordListProps) => import("react/jsx-runtime").JSX.Element;
export {};
