"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginPanelPlugin = exports.pluginPanelPluginGetRoute = exports.pluginPanelPluginGetVoSchema = exports.pluginPanelPluginGetRoSchema = exports.PLUGIN_PANEL_PLUGIN_GET = void 0;
const axios_1 = require("../axios");
const types_1 = require("../dashboard/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_PLUGIN_GET = '/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}';
exports.pluginPanelPluginGetRoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    pluginPanelId: zod_1.z.string(),
    pluginId: zod_1.z.string(),
});
exports.pluginPanelPluginGetVoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    name: zod_1.z.string(),
    tableId: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: types_1.pluginInstallStorageSchema.optional(),
});
exports.pluginPanelPluginGetRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_PANEL_PLUGIN_GET,
    description: 'Get a plugin in plugin panel',
    request: {
        params: exports.pluginPanelPluginGetRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the plugin.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelPluginGetVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const getPluginPanelPlugin = (tableId, pluginPanelId, pluginInstallId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_PLUGIN_GET, { tableId, pluginPanelId, pluginInstallId }));
};
exports.getPluginPanelPlugin = getPluginPanelPlugin;
