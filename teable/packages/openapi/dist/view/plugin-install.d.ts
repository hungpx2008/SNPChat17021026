import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_INSTALL_PLUGIN = "/table/{tableId}/view/plugin";
export declare const viewInstallPluginRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    pluginId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    pluginId: string;
    name?: string | undefined;
}, {
    pluginId: string;
    name?: string | undefined;
}>;
export type IViewInstallPluginRo = z.infer<typeof viewInstallPluginRoSchema>;
export declare const viewInstallPluginVoSchema: z.ZodObject<{
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    name: z.ZodString;
    viewId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    viewId: string;
    pluginInstallId: string;
    pluginId: string;
}, {
    name: string;
    viewId: string;
    pluginInstallId: string;
    pluginId: string;
}>;
export type IViewInstallPluginVo = z.infer<typeof viewInstallPluginVoSchema>;
export declare const ViewInstallPluginRoute: RouteConfig;
export declare const installViewPlugin: (tableId: string, ro: IViewInstallPluginRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    viewId: string;
    pluginInstallId: string;
    pluginId: string;
}, any>>;
