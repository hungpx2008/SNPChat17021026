import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IGetRecordsRo } from '../record';
import { z } from '../zod';
export declare const GET_COMMENT_COUNT = "/comment/{tableId}/count";
export declare const commentCountVoSchema: z.ZodArray<z.ZodObject<{
    recordId: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    recordId: string;
    count: number;
}, {
    recordId: string;
    count: number;
}>, "many">;
export type ICommentCountVo = z.infer<typeof commentCountVoSchema>;
export declare const GetCommentCountRoute: RouteConfig;
export declare const getCommentCount: (tableId: string, query: IGetRecordsRo) => Promise<import("axios").AxiosResponse<{
    recordId: string;
    count: number;
}[], any>>;
