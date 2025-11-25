import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_RECORD_COMMENT_COUNT = "/comment/{tableId}/{recordId}/count";
export declare const recordCommentCountVoSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    count: number;
}, {
    count: number;
}>;
export type IRecordCommentCountVo = z.infer<typeof recordCommentCountVoSchema>;
export declare const GetRecordCommentCountRoute: RouteConfig;
export declare const getRecordCommentCount: (tableId: string, recordId: string) => Promise<import("axios").AxiosResponse<{
    count: number;
}, any>>;
