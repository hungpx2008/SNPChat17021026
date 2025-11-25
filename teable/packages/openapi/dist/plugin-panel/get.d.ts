import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_GET = "/table/{tableId}/plugin-panel/{pluginPanelId}";
export declare const pluginPanelPluginItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    positionId: z.ZodString;
    pluginInstallId: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    pluginInstallId: string;
    positionId: string;
    url?: string | undefined;
}, {
    name: string;
    id: string;
    pluginInstallId: string;
    positionId: string;
    url?: string | undefined;
}>;
export type IPluginPanelPluginItem = z.infer<typeof pluginPanelPluginItemSchema>;
export declare const pluginPanelGetVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    layout: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    pluginMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        positionId: z.ZodString;
        pluginInstallId: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        pluginInstallId: string;
        positionId: string;
        url?: string | undefined;
    }, {
        name: string;
        id: string;
        pluginInstallId: string;
        positionId: string;
        url?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        positionId: string;
        url?: string | undefined;
    }> | undefined;
}, {
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        positionId: string;
        url?: string | undefined;
    }> | undefined;
}>;
export type IPluginPanelGetVo = z.infer<typeof pluginPanelGetVoSchema>;
export declare const pluginPanelGetRoute: RouteConfig;
export declare const getPluginPanel: (tableId: string, pluginPanelId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    layout?: {
        pluginInstallId: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[] | undefined;
    pluginMap?: Record<string, {
        name: string;
        id: string;
        pluginInstallId: string;
        positionId: string;
        url?: string | undefined;
    }> | undefined;
}, any>>;
