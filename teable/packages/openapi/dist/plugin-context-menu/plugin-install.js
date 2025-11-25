"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPluginContextMenu = exports.pluginContextMenuInstallRoute = exports.pluginContextMenuInstallVoSchema = exports.pluginContextMenuInstallRoSchema = exports.PLUGIN_CONTEXT_MENU_INSTALL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_INSTALL = '/table/{tableId}/plugin-context-menu/install';
exports.pluginContextMenuInstallRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    pluginId: zod_1.z.string(),
});
exports.pluginContextMenuInstallVoSchema = zod_1.z.object({
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
    order: zod_1.z.number(),
});
exports.pluginContextMenuInstallRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_CONTEXT_MENU_INSTALL,
    description: 'Install a plugin context menu',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuInstallRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Plugin context menu installed successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuInstallVoSchema,
                },
            },
        },
    },
    tags: ['plugin-context-menu'],
});
const installPluginContextMenu = async (tableId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_INSTALL, { tableId }), ro);
};
exports.installPluginContextMenu = installPluginContextMenu;
