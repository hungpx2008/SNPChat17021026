import type { IRecord } from '@teable/core';
import type { IGetRecordsRo } from '@teable/openapi';
export declare const useRecords: (query?: IGetRecordsRo, initData?: IRecord[]) => {
    records: import("../model").Record[];
    extra: unknown;
};
