import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PluginPosition, PluginStatus } from './types';
export declare const PLUGIN_CENTER_GET_LIST = "/plugin/center/list";
export declare const getPluginCenterListRoSchema: z.ZodObject<{
    ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    positions: z.ZodEffects<z.ZodOptional<z.ZodString>, PluginPosition[] | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    positions?: PluginPosition[] | undefined;
    ids?: string[] | undefined;
}, {
    positions?: string | undefined;
    ids?: string[] | undefined;
}>;
export type IGetPluginCenterListRo = z.infer<typeof getPluginCenterListRoSchema>;
export declare const getPluginCenterListVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    detailDesc: z.ZodOptional<z.ZodString>;
    logo: z.ZodString;
    helpUrl: z.ZodOptional<z.ZodString>;
    i18n: z.ZodOptional<z.ZodRecord<z.ZodEnum<["en", "zh", "fr"]>, z.ZodType<import("./types").IPlugin18nJsonType, z.ZodTypeDef, import("./types").IPlugin18nJsonType>>>;
    url: z.ZodOptional<z.ZodString>;
    status: z.ZodNativeEnum<typeof PluginStatus>;
    createdTime: z.ZodString;
    lastModifiedTime: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    status: PluginStatus;
    name: string;
    id: string;
    createdBy: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    };
    createdTime: string;
    logo: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    lastModifiedTime?: string | undefined;
}, {
    status: PluginStatus;
    name: string;
    id: string;
    createdBy: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    };
    createdTime: string;
    logo: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    lastModifiedTime?: string | undefined;
}>, "many">;
export type IGetPluginCenterListVo = z.infer<typeof getPluginCenterListVoSchema>;
export declare const GetPluginCenterListRoute: RouteConfig;
export declare const getPluginCenterList: (positions?: PluginPosition[], ids?: string[]) => Promise<import("axios").AxiosResponse<{
    status: PluginStatus;
    name: string;
    id: string;
    createdBy: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    };
    createdTime: string;
    logo: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    lastModifiedTime?: string | undefined;
}[], any>>;
