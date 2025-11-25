import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_MOVE = "/table/{tableId}/plugin-context-menu/{pluginInstallId}/move";
export declare const pluginContextMenuMoveRoSchema: z.ZodObject<{
    anchorId: z.ZodString;
    position: z.ZodEnum<["before", "after"]>;
}, "strip", z.ZodTypeAny, {
    anchorId: string;
    position: "before" | "after";
}, {
    anchorId: string;
    position: "before" | "after";
}>;
export type IPluginContextMenuMoveRo = z.infer<typeof pluginContextMenuMoveRoSchema>;
export declare const pluginContextMenuMoveRoute: RouteConfig;
export declare const movePluginContextMenu: (tableId: string, pluginInstallId: string, ro: IPluginContextMenuMoveRo) => Promise<import("axios").AxiosResponse<void, any>>;
