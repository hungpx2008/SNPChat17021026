import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_DASHBOARD = "/base/{baseId}/dashboard";
export declare const createDashboardRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type ICreateDashboardRo = z.infer<typeof createDashboardRoSchema>;
export declare const createDashboardVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type ICreateDashboardVo = z.infer<typeof createDashboardVoSchema>;
export declare const CreateDashboardRoute: RouteConfig;
export declare const createDashboard: (baseId: string, body: z.infer<typeof createDashboardRoSchema>) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
