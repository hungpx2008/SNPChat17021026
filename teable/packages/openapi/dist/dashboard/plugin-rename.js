"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePlugin = exports.DashboardPluginRenameRoute = exports.dashboardPluginRenameVoSchema = exports.dashboardPluginRenameRoSchema = exports.DASHBOARD_PLUGIN_RENAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DASHBOARD_PLUGIN_RENAME = '/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/rename';
exports.dashboardPluginRenameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.dashboardPluginRenameVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.DashboardPluginRenameRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.DASHBOARD_PLUGIN_RENAME,
    description: 'Rename a plugin in a dashboard',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.dashboardPluginRenameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the renamed plugin.',
            content: {
                'application/json': {
                    schema: exports.dashboardPluginRenameVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const renamePlugin = async (baseId, dashboardId, pluginInstallId, name) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.DASHBOARD_PLUGIN_RENAME, { baseId, dashboardId, pluginInstallId }), { name });
};
exports.renamePlugin = renamePlugin;
