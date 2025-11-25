import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
import { LastVisitResourceType } from './get';
export declare const UPDATE_USER_LAST_VISIT = "/user/last-visit";
export declare const updateUserLastVisitRoSchema: z.ZodObject<{
    resourceType: z.ZodNativeEnum<typeof LastVisitResourceType>;
    resourceId: z.ZodString;
    parentResourceId: z.ZodString;
    childResourceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    parentResourceId: string;
    childResourceId?: string | undefined;
}, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    parentResourceId: string;
    childResourceId?: string | undefined;
}>;
export type IUpdateUserLastVisitRo = z.infer<typeof updateUserLastVisitRoSchema>;
export declare const UpdateUserLastVisitRoute: RouteConfig;
export declare const updateUserLastVisit: (updateUserLastVisitRo: IUpdateUserLastVisitRo) => Promise<import("axios").AxiosResponse<{
    resourceType: LastVisitResourceType;
    resourceId: string;
    parentResourceId: string;
    childResourceId?: string | undefined;
}, any>>;
