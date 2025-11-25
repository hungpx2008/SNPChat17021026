import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const GET_USER_LAST_VISIT = "/user/last-visit";
export declare enum LastVisitResourceType {
    Base = "base",
    Table = "table",
    View = "view",
    Dashboard = "dashboard",
    Automation = "automation"
}
export declare const userLastVisitVoSchema: z.ZodObject<{
    resourceType: z.ZodNativeEnum<typeof LastVisitResourceType>;
    resourceId: z.ZodString;
    childResourceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
}, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
}>;
export type IUserLastVisitVo = z.infer<typeof userLastVisitVoSchema>;
export declare const getUserLastVisitRoSchema: z.ZodObject<{
    resourceType: z.ZodNativeEnum<typeof LastVisitResourceType>;
    parentResourceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    resourceType: LastVisitResourceType;
    parentResourceId: string;
}, {
    resourceType: LastVisitResourceType;
    parentResourceId: string;
}>;
export type IGetUserLastVisitRo = z.infer<typeof getUserLastVisitRoSchema>;
export declare const GetUserLastVisitRoute: RouteConfig;
export declare const getUserLastVisit: (params: IGetUserLastVisitRo) => Promise<import("axios").AxiosResponse<{
    resourceType: LastVisitResourceType;
    resourceId: string;
    childResourceId?: string | undefined;
} | undefined, any>>;
