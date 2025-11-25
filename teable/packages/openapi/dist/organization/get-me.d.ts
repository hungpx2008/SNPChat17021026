import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_ORGANIZATION_ME = "/organization/me";
export declare const organizationVoSchema: z.ZodOptional<z.ZodNullable<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    isAdmin: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    isAdmin: boolean;
}, {
    name: string;
    id: string;
    isAdmin: boolean;
}>>>;
export type IOrganizationMeVo = z.infer<typeof organizationVoSchema>;
export declare const getOrganizationMeRoute: RouteConfig;
export declare const getOrganizationMe: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    isAdmin: boolean;
} | null | undefined, any>>;
