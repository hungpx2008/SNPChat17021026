import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IGetBaseAllVo } from '../base';
import { z } from '../zod';
export declare const GET_BASE_LIST = "/space/{spaceId}/base";
export declare const getBaseListRoSchema: z.ZodObject<{
    spaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
}, {
    spaceId: string;
}>;
export type IGetBasesListRo = z.infer<typeof getBaseListRoSchema>;
export declare const GetBaseListRoute: RouteConfig;
export declare const getBaseList: (query: IGetBasesListRo) => Promise<import("axios").AxiosResponse<IGetBaseAllVo, any>>;
