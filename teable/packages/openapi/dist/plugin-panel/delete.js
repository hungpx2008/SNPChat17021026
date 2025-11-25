"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePluginPanel = exports.pluginPanelDeleteRoute = exports.PLUGIN_PANEL_DELETE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_DELETE = '/table/{tableId}/plugin-panel/{pluginPanelId}';
exports.pluginPanelDeleteRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PLUGIN_PANEL_DELETE,
    description: 'Delete a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin panel deleted successfully.',
        },
    },
    tags: ['plugin-panel'],
});
const deletePluginPanel = async (tableId, pluginPanelId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_DELETE, { tableId, pluginPanelId }));
};
exports.deletePluginPanel = deletePluginPanel;
