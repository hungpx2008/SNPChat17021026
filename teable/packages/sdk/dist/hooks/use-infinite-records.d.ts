import type { IRecord } from '@teable/core';
import type { IGetRecordsRo } from '@teable/openapi';
import type { Record } from '../model';
export declare const LOAD_PAGE_SIZE = 300;
interface IVisiblePages {
    y: number;
    height: number;
}
type IRes = {
    recordMap: IRecordIndexMap;
    onReset: () => void;
    onForceUpdate: () => void;
    onVisibleRegionChanged: (r: IVisiblePages) => void;
};
export type IRecordIndexMap = {
    [i: number | string]: Record;
};
export declare const useInfiniteRecords: (recordsQuery?: Omit<IGetRecordsRo, 'take' | 'skip'>, initRecords?: IRecord[]) => IRes;
export {};
