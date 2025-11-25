import { z } from '../zod';
export type IPlugin18nJsonType = {
    [key: string]: string | IPlugin18nJsonType;
};
export declare const pluginI18nJsonSchema: z.ZodType<IPlugin18nJsonType>;
export declare const pluginI18nSchema: z.ZodRecord<z.ZodEnum<["en", "zh", "fr"]>, z.ZodType<IPlugin18nJsonType, z.ZodTypeDef, IPlugin18nJsonType>>;
export type IPluginI18n = z.infer<typeof pluginI18nSchema>;
export declare enum PluginPosition {
    Dashboard = "dashboard",
    View = "view",
    ContextMenu = "contextMenu",
    Panel = "panel"
}
export declare enum PluginStatus {
    Developing = "developing",
    Reviewing = "reviewing",
    Published = "published"
}
export declare const pluginUserSchema: z.ZodOptional<z.ZodObject<{
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
export declare const pluginCreatedBySchema: z.ZodObject<{
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
export declare const pluginConfigSchema: z.ZodEffects<z.ZodObject<{
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
}>;
export type IPluginConfig = z.infer<typeof pluginConfigSchema>;
