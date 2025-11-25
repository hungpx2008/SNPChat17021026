"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePluginPanelPlugin = exports.pluginPanelRemoveRoute = exports.PLUGIN_PANEL_REMOVE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_REMOVE = '/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}';
exports.pluginPanelRemoveRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PLUGIN_PANEL_REMOVE,
    description: 'Remove a plugin from a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin removed from plugin panel successfully.',
        },
    },
    tags: ['plugin-panel'],
});
const removePluginPanelPlugin = async (tableId, pluginPanelId, pluginInstallId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_REMOVE, { tableId, pluginPanelId, pluginInstallId }));
};
exports.removePluginPanelPlugin = removePluginPanelPlugin;
