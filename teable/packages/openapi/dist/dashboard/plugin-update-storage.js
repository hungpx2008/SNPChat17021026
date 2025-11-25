"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDashboardPluginStorage = exports.DashboardPluginUpdateStorageRoute = exports.dashboardPluginUpdateStorageVoSchema = exports.dashboardPluginUpdateStorageRoSchema = exports.DASHBOARD_PLUGIN_UPDATE_STORAGE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.DASHBOARD_PLUGIN_UPDATE_STORAGE = '/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/update-storage';
exports.dashboardPluginUpdateStorageRoSchema = zod_1.z.object({
    storage: types_1.pluginInstallStorageSchema.optional(),
});
exports.dashboardPluginUpdateStorageVoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    dashboardId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: types_1.pluginInstallStorageSchema.optional(),
});
exports.DashboardPluginUpdateStorageRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.DASHBOARD_PLUGIN_UPDATE_STORAGE,
    description: 'Update storage of a plugin in a dashboard',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            dashboardId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.dashboardPluginUpdateStorageRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the updated plugin.',
            content: {
                'application/json': {
                    schema: exports.dashboardPluginUpdateStorageVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const updateDashboardPluginStorage = async (baseId, dashboardId, pluginInstallId, storage) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.DASHBOARD_PLUGIN_UPDATE_STORAGE, { baseId, dashboardId, pluginInstallId }), { storage });
};
exports.updateDashboardPluginStorage = updateDashboardPluginStorage;
