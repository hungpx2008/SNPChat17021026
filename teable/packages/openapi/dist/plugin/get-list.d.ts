import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PluginPosition, PluginStatus } from './types';
export declare const GET_PLUGINS = "/plugin";
export declare const getPluginsVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    detailDesc: z.ZodOptional<z.ZodString>;
    logo: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    helpUrl: z.ZodOptional<z.ZodString>;
    positions: z.ZodArray<z.ZodNativeEnum<typeof PluginPosition>, "many">;
    i18n: z.ZodRecord<z.ZodEnum<["en", "zh", "fr"]>, z.ZodType<import("./types").IPlugin18nJsonType, z.ZodTypeDef, import("./types").IPlugin18nJsonType>>;
    status: z.ZodNativeEnum<typeof PluginStatus>;
    pluginUser: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    }>>;
    createdTime: z.ZodString;
    lastModifiedTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: PluginStatus;
    name: string;
    id: string;
    createdTime: string;
    logo: string;
    positions: PluginPosition[];
    i18n: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>>;
    lastModifiedTime: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    pluginUser?: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    } | undefined;
}, {
    status: PluginStatus;
    name: string;
    id: string;
    createdTime: string;
    logo: string;
    positions: PluginPosition[];
    i18n: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>>;
    lastModifiedTime: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    pluginUser?: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    } | undefined;
}>, "many">;
export type IGetPluginsVo = z.infer<typeof getPluginsVoSchema>;
export declare const GetPluginsRoute: RouteConfig;
export declare const getPlugins: () => Promise<import("axios").AxiosResponse<{
    status: PluginStatus;
    name: string;
    id: string;
    createdTime: string;
    logo: string;
    positions: PluginPosition[];
    i18n: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>>;
    lastModifiedTime: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    pluginUser?: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    } | undefined;
}[], any>>;
