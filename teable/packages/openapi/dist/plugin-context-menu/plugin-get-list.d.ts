import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
export declare const PLUGIN_CONTEXT_MENU_GET_LIST = "/table/{tableId}/plugin-context-menu";
export declare const pluginContextMenuGetItemSchema: z.ZodObject<{
    pluginInstallId: z.ZodString;
    name: z.ZodString;
    pluginId: z.ZodString;
    logo: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    order: number;
    pluginInstallId: string;
    pluginId: string;
    logo: string;
}, {
    name: string;
    order: number;
    pluginInstallId: string;
    pluginId: string;
    logo: string;
}>;
export type IPluginContextMenuGetItem = z.infer<typeof pluginContextMenuGetItemSchema>;
export declare const getPluginContextMenuListRoute: RouteConfig;
export declare const getPluginContextMenuList: (tableId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    order: number;
    pluginInstallId: string;
    pluginId: string;
    logo: string;
}[], any>>;
