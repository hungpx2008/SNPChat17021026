import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_LIST = "/table/{tableId}/plugin-panel";
export declare const pluginPanelListVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>, "many">;
export type IPluginPanelListVo = z.infer<typeof pluginPanelListVoSchema>;
export declare const pluginPanelListRoute: RouteConfig;
export declare const listPluginPanels: (tableId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}[], any>>;
