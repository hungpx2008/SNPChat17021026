import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DUPLICATE_DASHBOARD_INSTALLED_PLUGIN = "/base/{baseId}/dashboard/{id}/plugin/{installedId}/duplicate";
export declare const duplicateDashboardInstalledPluginRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type IDuplicateDashboardInstalledPluginRo = z.infer<typeof duplicateDashboardInstalledPluginRoSchema>;
export declare const duplicateDashboardInstalledPluginRoute: RouteConfig;
export declare const duplicateDashboardInstalledPlugin: (baseId: string, id: string, installedId: string, duplicateDashboardRo: IDuplicateDashboardInstalledPluginRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    name: string;
}, any>>;
