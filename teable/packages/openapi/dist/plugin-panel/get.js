"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginPanel = exports.pluginPanelGetRoute = exports.pluginPanelGetVoSchema = exports.pluginPanelPluginItemSchema = exports.PLUGIN_PANEL_GET = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_GET = '/table/{tableId}/plugin-panel/{pluginPanelId}';
exports.pluginPanelPluginItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    positionId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    url: zod_1.z.string().optional(),
});
exports.pluginPanelGetVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    layout: dashboard_1.dashboardLayoutSchema.optional(),
    pluginMap: zod_1.z.record(zod_1.z.string(), exports.pluginPanelPluginItemSchema).optional(),
});
exports.pluginPanelGetRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_PANEL_GET,
    description: 'Get a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin panel retrieved successfully.',
        },
    },
    tags: ['plugin-panel'],
});
const getPluginPanel = async (tableId, pluginPanelId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_GET, { tableId, pluginPanelId }));
};
exports.getPluginPanel = getPluginPanel;
