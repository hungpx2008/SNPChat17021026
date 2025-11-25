import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_UNSUBSCRIBE_LIST = "/unsubscribe/list/{baseId}";
export declare const unsubscribeItemVoSchema: z.ZodObject<{
    email: z.ZodString;
    createdTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    createdTime: string;
}, {
    email: string;
    createdTime: string;
}>;
export type IUnsubscribeItemVo = z.infer<typeof unsubscribeItemVoSchema>;
export declare const unsubscribeListVoSchema: z.ZodArray<z.ZodObject<{
    email: z.ZodString;
    createdTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    createdTime: string;
}, {
    email: string;
    createdTime: string;
}>, "many">;
export type IUnsubscribeListVo = z.infer<typeof unsubscribeListVoSchema>;
export declare const unsubscribeListPaginatedVoSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        email: z.ZodString;
        createdTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        createdTime: string;
    }, {
        email: string;
        createdTime: string;
    }>, "many">;
    hasMore: z.ZodBoolean;
    pageSize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    data: {
        email: string;
        createdTime: string;
    }[];
    hasMore: boolean;
    pageSize: number;
}, {
    data: {
        email: string;
        createdTime: string;
    }[];
    hasMore: boolean;
    pageSize: number;
}>;
export type IUnsubscribeListPaginatedVo = z.infer<typeof unsubscribeListPaginatedVoSchema>;
export declare const getUnSubscribeListRoute: RouteConfig;
export declare const getUnSubscribeList: (baseId: string, params?: {
    pageSize?: number;
    cursor?: string;
    search?: string;
}) => Promise<import("axios").AxiosResponse<{
    data: {
        email: string;
        createdTime: string;
    }[];
    hasMore: boolean;
    pageSize: number;
}, any>>;
