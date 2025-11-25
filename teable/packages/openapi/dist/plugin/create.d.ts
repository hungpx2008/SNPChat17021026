import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PluginPosition, PluginStatus } from './types';
export declare const CREATE_PLUGIN = "/plugin";
export declare const createPluginRoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    detailDesc: z.ZodOptional<z.ZodString>;
    logo: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    config: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        contextMenu: z.ZodOptional<z.ZodObject<{
            width: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            height: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            x: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            y: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            frozenResize: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            frozenDrag: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        }, {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        }>>;
        view: z.ZodOptional<z.ZodNull>;
        dashboard: z.ZodOptional<z.ZodNull>;
        panel: z.ZodOptional<z.ZodNull>;
    }, "strip", z.ZodTypeAny, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }>, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }>>;
    helpUrl: z.ZodOptional<z.ZodString>;
    positions: z.ZodArray<z.ZodNativeEnum<typeof PluginPosition>, "many">;
    i18n: z.ZodOptional<z.ZodRecord<z.ZodEnum<["en", "zh", "fr"]>, z.ZodType<import("./types").IPlugin18nJsonType, z.ZodTypeDef, import("./types").IPlugin18nJsonType>>>;
    autoCreateMember: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    logo: string;
    positions: PluginPosition[];
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    config?: {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    } | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    autoCreateMember?: boolean | undefined;
}, {
    name: string;
    logo: string;
    positions: PluginPosition[];
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    config?: {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    } | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    autoCreateMember?: boolean | undefined;
}>;
export type ICreatePluginRo = z.infer<typeof createPluginRoSchema>;
export declare const createPluginVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    detailDesc: z.ZodOptional<z.ZodString>;
    logo: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    config: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        contextMenu: z.ZodOptional<z.ZodObject<{
            width: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            height: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            x: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            y: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
            frozenResize: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            frozenDrag: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        }, {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        }>>;
        view: z.ZodOptional<z.ZodNull>;
        dashboard: z.ZodOptional<z.ZodNull>;
        panel: z.ZodOptional<z.ZodNull>;
    }, "strip", z.ZodTypeAny, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }>, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }, {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    }>>;
    helpUrl: z.ZodOptional<z.ZodString>;
    positions: z.ZodArray<z.ZodNativeEnum<typeof PluginPosition>, "many">;
    i18n: z.ZodOptional<z.ZodRecord<z.ZodEnum<["en", "zh", "fr"]>, z.ZodType<import("./types").IPlugin18nJsonType, z.ZodTypeDef, import("./types").IPlugin18nJsonType>>>;
    secret: z.ZodString;
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
}, "strip", z.ZodTypeAny, {
    status: PluginStatus;
    name: string;
    id: string;
    createdTime: string;
    logo: string;
    positions: PluginPosition[];
    secret: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    config?: {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    } | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
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
    secret: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    config?: {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    } | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    pluginUser?: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    } | undefined;
}>;
export type ICreatePluginVo = z.infer<typeof createPluginVoSchema>;
export declare const createPluginRoute: RouteConfig;
export declare const createPlugin: (data: ICreatePluginRo) => Promise<import("axios").AxiosResponse<{
    status: PluginStatus;
    name: string;
    id: string;
    createdTime: string;
    logo: string;
    positions: PluginPosition[];
    secret: string;
    url?: string | undefined;
    description?: string | undefined;
    detailDesc?: string | undefined;
    config?: {
        dashboard?: null | undefined;
        view?: null | undefined;
        contextMenu?: {
            x?: string | number | undefined;
            y?: string | number | undefined;
            width?: string | number | undefined;
            height?: string | number | undefined;
            frozenResize?: boolean | undefined;
            frozenDrag?: boolean | undefined;
        } | undefined;
        panel?: null | undefined;
    } | undefined;
    helpUrl?: string | undefined;
    i18n?: Partial<Record<"en" | "zh" | "fr", import("./types").IPlugin18nJsonType>> | undefined;
    pluginUser?: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
    } | undefined;
}, any>>;
