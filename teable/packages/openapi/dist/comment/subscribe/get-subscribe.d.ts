import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const GET_COMMENT_SUBSCRIBE = "/comment/{tableId}/{recordId}/subscribe";
export declare const commentSubscribeVoSchema: z.ZodObject<{
    tableId: z.ZodString;
    recordId: z.ZodString;
    createdBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    recordId: string;
    createdBy: string;
}, {
    tableId: string;
    recordId: string;
    createdBy: string;
}>;
export type ICommentSubscribeVo = z.infer<typeof commentSubscribeVoSchema>;
export declare const GetCommentSubscribeRoute: RouteConfig;
export declare const getCommentSubscribe: (tableId: string, recordId: string) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    recordId: string;
    createdBy: string;
} | null, any>>;
