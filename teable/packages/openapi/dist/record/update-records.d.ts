import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord } from '@teable/core';
import type { AxiosResponse } from 'axios';
import type { IUpdateRecordsRo } from './update';
export declare const UPDATE_RECORDS = "/table/{tableId}/record";
export declare const UpdateRecordsRoute: RouteConfig;
export declare function updateRecords(tableId: string, recordsRo: IUpdateRecordsRo): Promise<AxiosResponse<IRecord[]>>;
