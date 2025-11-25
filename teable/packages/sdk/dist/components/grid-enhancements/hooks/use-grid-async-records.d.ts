import type { IRecord } from '@teable/core';
import type { IGetRecordsRo, IGroupHeaderRef, IGroupPointsVo } from '@teable/openapi';
import type { IGridProps } from '../..';
import type { Record as IRecordInstance } from '../../../model';
export declare const LOAD_PAGE_SIZE = 300;
type IRes = {
    allGroupHeaderRefs: IGroupHeaderRef[];
    groupPoints: IGroupPointsVo | null;
    searchHitIndex?: {
        fieldId: string;
        recordId: string;
    }[];
    recordMap: IRecordIndexMap;
    onReset: () => void;
    onForceUpdate: () => void;
    recordsQuery: IGetRecordsRo;
    onVisibleRegionChanged: NonNullable<IGridProps['onVisibleRegionChanged']>;
};
export type IRecordIndexMap = {
    [i: number | string]: IRecordInstance;
};
export type IRecordSearchHitIndexItem = {
    recordId: string;
    fieldId: string[];
};
export type IRecordSearchHitIndex = IRecordSearchHitIndexItem[];
export type IRecordSearchHitIndexMap = Record<string | number, IRecordSearchHitIndexItem>;
export type ISearchHits = {
    recordId: string;
    fieldId: string;
}[];
export declare const useGridAsyncRecords: (initRecords?: IRecord[], initQuery?: IGetRecordsRo, outerQuery?: Pick<IGetRecordsRo, 'filter' | 'orderBy' | 'groupBy' | 'collapsedGroupIds'>, initGroupPoints?: IGroupPointsVo) => IRes;
export {};
