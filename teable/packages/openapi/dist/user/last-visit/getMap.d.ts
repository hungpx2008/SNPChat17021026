import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
import type { IGetUserLastVisitRo } from './get';
export declare const GET_USER_LAST_VISIT_MAP = "/user/last-visit/map";
export declare const userLastVisitMapVoSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    resourceType: z.ZodNativeEnum<typeof import("./get").LastVisitResourceType>;
    resourceId: z.ZodString;
    childResourceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resourceType: import("./get").LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
}, {
    resourceType: import("./get").LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
}>>;
export type IUserLastVisitMapVo = z.infer<typeof userLastVisitMapVoSchema>;
export declare const GetUserLastVisitMapRoute: RouteConfig;
export declare const getUserLastVisitMap: (params: IGetUserLastVisitRo) => Promise<import("axios").AxiosResponse<Record<string, {
    resourceType: import("./get").LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
}>, any>>;
