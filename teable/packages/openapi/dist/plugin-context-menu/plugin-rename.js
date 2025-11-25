"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePluginContextMenu = exports.pluginContextMenuRenameRoute = exports.pluginContextMenuRenameVoSchema = exports.pluginContextMenuRenameRoSchema = exports.PLUGIN_CONTEXT_MENU_RENAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_RENAME = '/table/{tableId}/plugin-context-menu/{pluginInstallId}/rename';
exports.pluginContextMenuRenameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.pluginContextMenuRenameVoSchema = zod_1.z.object({
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.pluginContextMenuRenameRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_CONTEXT_MENU_RENAME,
    description: 'Rename a plugin context menu',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuRenameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Plugin context menu renamed successfully.',
        },
    },
    tags: ['plugin-context-menu'],
});
const renamePluginContextMenu = async (tableId, pluginInstallId, ro) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_RENAME, { tableId, pluginInstallId }), ro);
};
exports.renamePluginContextMenu = renamePluginContextMenu;
