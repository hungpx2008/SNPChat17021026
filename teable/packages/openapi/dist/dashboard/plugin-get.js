"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardInstallPlugin = exports.GetDashboardInstallPluginRoute = exports.getDashboardInstallPluginVoSchema = exports.getDashboardInstallPluginRoSchema = exports.GET_DASHBOARD_INSTALL_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_DASHBOARD_INSTALL_PLUGIN = '/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}';
exports.getDashboardInstallPluginRoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    dashboardId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
});
exports.getDashboardInstallPluginVoSchema = zod_1.z.object({
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    baseId: zod_1.z.string(),
    name: zod_1.z.string(),
    storage: types_1.pluginInstallStorageSchema.optional(),
});
exports.GetDashboardInstallPluginRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DASHBOARD_INSTALL_PLUGIN,
    description: 'Get a dashboard install plugin by id',
    request: {
        params: exports.getDashboardInstallPluginRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the dashboard install plugin.',
            content: {
                'application/json': {
                    schema: exports.getDashboardInstallPluginVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const getDashboardInstallPlugin = async (baseId, dashboardId, pluginInstallId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DASHBOARD_INSTALL_PLUGIN, { baseId, dashboardId, pluginInstallId }));
};
exports.getDashboardInstallPlugin = getDashboardInstallPlugin;
