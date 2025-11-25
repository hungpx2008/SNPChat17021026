import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_UPDATE_LAYOUT = "/table/{tableId}/plugin-panel/{pluginPanelId}/layout";
export declare const pluginPanelUpdateLayoutRoSchema: z.ZodObject<{
    layout: z.ZodArray<z.ZodObject<{
        pluginInstallId: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, {
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}>;
export type IPluginPanelUpdateLayoutRo = z.infer<typeof pluginPanelUpdateLayoutRoSchema>;
export declare const pluginPanelUpdateLayoutVoSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodArray<z.ZodObject<{
        pluginInstallId: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, {
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}>;
export type IPluginPanelUpdateLayoutVo = z.infer<typeof pluginPanelUpdateLayoutVoSchema>;
export declare const pluginPanelUpdateLayoutRoute: RouteConfig;
export declare const updatePluginPanelLayout: (tableId: string, pluginPanelId: string, ro: IPluginPanelUpdateLayoutRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    layout: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}, any>>;
