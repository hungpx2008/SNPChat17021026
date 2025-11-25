import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord } from '@teable/core';
import type { AxiosResponse } from 'axios';
export declare const DELETE_RECORD_URL = "/table/{tableId}/record/{recordId}";
export declare const DeleteRecordRoute: RouteConfig;
export declare function deleteRecord(tableId: string, recordId: string): Promise<AxiosResponse<IRecord>>;
