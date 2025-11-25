import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const RENAME_DASHBOARD = "/base/{baseId}/dashboard/{dashboardId}/rename";
export declare const renameDashboardRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IRenameDashboardRo = z.infer<typeof renameDashboardRoSchema>;
export declare const renameDashboardVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type IRenameDashboardVo = z.infer<typeof renameDashboardVoSchema>;
export declare const RenameDashboardRoute: RouteConfig;
export declare const renameDashboard: (baseId: string, dashboardId: string, name: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
