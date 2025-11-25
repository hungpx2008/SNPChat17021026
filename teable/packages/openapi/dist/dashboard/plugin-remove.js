"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlugin = exports.DashboardRemovePluginRoute = exports.DASHBOARD_REMOVE_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DASHBOARD_REMOVE_PLUGIN = '/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}';
exports.DashboardRemovePluginRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DASHBOARD_REMOVE_PLUGIN,
    description: 'Remove a plugin from a dashboard',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            dashboardId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin removed successfully.',
        },
    },
    tags: ['dashboard'],
});
const removePlugin = async (baseId, dashboardId, pluginInstallId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DASHBOARD_REMOVE_PLUGIN, { baseId, dashboardId, pluginInstallId }));
};
exports.removePlugin = removePlugin;
