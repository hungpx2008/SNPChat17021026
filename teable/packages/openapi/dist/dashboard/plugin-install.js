"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPlugin = exports.DashboardInstallPluginRoute = exports.dashboardInstallPluginVoSchema = exports.dashboardInstallPluginRoSchema = exports.DASHBOARD_INSTALL_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DASHBOARD_INSTALL_PLUGIN = '/base/{baseId}/dashboard/{id}/plugin';
exports.dashboardInstallPluginRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    pluginId: zod_1.z.string(),
});
exports.dashboardInstallPluginVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.DashboardInstallPluginRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DASHBOARD_INSTALL_PLUGIN,
    description: 'Install a plugin to a dashboard',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.dashboardInstallPluginRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about the installed plugin.',
            content: {
                'application/json': {
                    schema: exports.dashboardInstallPluginVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const installPlugin = async (baseId, id, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DASHBOARD_INSTALL_PLUGIN, { baseId, id }), ro);
};
exports.installPlugin = installPlugin;
