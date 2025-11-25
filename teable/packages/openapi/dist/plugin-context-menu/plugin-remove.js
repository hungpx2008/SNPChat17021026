"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePluginContextMenu = exports.pluginContextMenuRemoveRoute = exports.pluginContextMenuRemoveRoSchema = exports.PLUGIN_CONTEXT_MENU_REMOVE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_REMOVE = '/table/{tableId}/plugin-context-menu/{pluginInstallId}';
exports.pluginContextMenuRemoveRoSchema = zod_1.z.object({
    pluginContextMenuId: zod_1.z.string(),
});
exports.pluginContextMenuRemoveRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PLUGIN_CONTEXT_MENU_REMOVE,
    description: 'Remove a plugin context menu',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin context menu removed successfully.',
        },
    },
    tags: ['plugin-context-menu'],
});
const removePluginContextMenu = async (tableId, pluginInstallId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_REMOVE, { tableId, pluginInstallId }));
};
exports.removePluginContextMenu = removePluginContextMenu;
