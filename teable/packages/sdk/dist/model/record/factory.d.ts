import type { IRecord } from '@teable/core';
import type { Doc } from 'sharedb/lib/client';
import type { IFieldInstance } from '../field';
import { Record } from './record';
export declare function createRecordInstance(record: IRecord, doc?: Doc<IRecord>): Record;
export declare function recordInstanceFieldMap(instance: Record, fieldMap: {
    [fieldId: string]: IFieldInstance;
}): Record;
