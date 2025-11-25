import type { IColumnStatistics, IGridColumn } from '../..';
export declare const useStatisticFunc2NameMap: () => {
    none: string;
    count: string;
    empty: string;
    filled: string;
    unique: string;
    max: string;
    min: string;
    sum: string;
    average: string;
    checked: string;
    unChecked: string;
    percentEmpty: string;
    percentFilled: string;
    percentUnique: string;
    percentChecked: string;
    percentUnChecked: string;
    earliestDate: string;
    latestDate: string;
    dateRangeOfDays: string;
    dateRangeOfMonths: string;
    totalAttachmentSize: string;
};
export declare function useGridColumnStatistics(columns: (IGridColumn & {
    id: string;
})[]): {
    columnStatistics: IColumnStatistics;
};
