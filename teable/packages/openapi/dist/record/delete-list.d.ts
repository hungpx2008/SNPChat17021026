import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const DELETE_RECORDS_URL = "/table/{tableId}/record";
export declare const deleteRecordsQuerySchema: z.ZodObject<{
    recordIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    recordIds: string[];
}, {
    recordIds: string[];
}>;
export type IDeleteRecordsQuery = z.infer<typeof deleteRecordsQuerySchema>;
export declare const DeleteRecordsRoute: RouteConfig;
export declare function deleteRecords(tableId: string, recordIds: string[]): Promise<AxiosResponse<null>>;
