import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_GET = "/table/{tableId}/plugin-context-menu/{pluginInstallId}";
export declare const pluginContextMenuGetVoSchema: z.ZodObject<{
    name: z.ZodString;
    tableId: z.ZodString;
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    positionId: z.ZodString;
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
}, "strip", z.ZodTypeAny, {
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    positionId: string;
    url?: string | undefined;
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
}, {
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    positionId: string;
    url?: string | undefined;
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
}>;
export type IPluginContextMenuGetVo = z.infer<typeof pluginContextMenuGetVoSchema>;
export declare const pluginContextMenuGetRoute: RouteConfig;
export declare const getPluginContextMenu: (tableId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    positionId: string;
    url?: string | undefined;
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
}, any>>;
