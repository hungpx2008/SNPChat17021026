import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
import type { IGetRecordsRo } from './get-list';
export declare const GET_RECORD_STATUS_URL = "/table/{tableId}/record/{recordId}/status";
export declare const recordStatusVoSchema: z.ZodObject<{
    isVisible: z.ZodBoolean;
    isDeleted: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isVisible: boolean;
    isDeleted: boolean;
}, {
    isVisible: boolean;
    isDeleted: boolean;
}>;
export type IRecordStatusVo = z.infer<typeof recordStatusVoSchema>;
export declare const GetRecordStatusRoute: RouteConfig;
export declare const getRecordStatus: (tableId: string, recordId: string, query?: IGetRecordsRo) => Promise<AxiosResponse<IRecordStatusVo>>;
