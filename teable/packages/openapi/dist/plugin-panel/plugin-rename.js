"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePluginPanelPlugin = exports.pluginPanelPluginRenameRoute = exports.pluginPanelPluginRenameVoSchema = exports.pluginPanelPluginRenameRoSchema = exports.PLUGIN_PANEL_PLUGIN_RENAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_PLUGIN_RENAME = '/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/rename';
exports.pluginPanelPluginRenameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.pluginPanelPluginRenameVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.pluginPanelPluginRenameRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_PANEL_PLUGIN_RENAME,
    description: 'Rename a plugin in a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelPluginRenameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Plugin renamed successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelPluginRenameVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const renamePluginPanelPlugin = async (tableId, pluginPanelId, pluginInstallId, name) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_PLUGIN_RENAME, { tableId, pluginPanelId, pluginInstallId }), {
        name,
    });
};
exports.renamePluginPanelPlugin = renamePluginPanelPlugin;
