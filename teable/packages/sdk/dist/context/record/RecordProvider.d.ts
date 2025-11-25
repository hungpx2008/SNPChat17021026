import type { IRecord } from '@teable/core';
import type { ReactNode } from 'react';
export interface IRecordProviderContext {
    children: ReactNode;
    serverRecords?: IRecord[];
    serverRecord?: IRecord;
}
export declare const RecordProvider: React.FC<IRecordProviderContext>;
