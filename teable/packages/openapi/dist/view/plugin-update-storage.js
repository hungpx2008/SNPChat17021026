"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewPluginStorage = exports.ViewPluginUpdateStorageRoute = exports.viewPluginUpdateStorageVoSchema = exports.viewPluginUpdateStorageRoSchema = exports.VIEW_PLUGIN_UPDATE_STORAGE = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_PLUGIN_UPDATE_STORAGE = '/table/{tableId}/view/{viewId}/plugin/{pluginInstallId}';
exports.viewPluginUpdateStorageRoSchema = zod_1.z.object({
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.viewPluginUpdateStorageVoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    viewId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.ViewPluginUpdateStorageRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.VIEW_PLUGIN_UPDATE_STORAGE,
    description: 'Update storage of a plugin in a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewPluginUpdateStorageRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the updated plugin.',
            content: {
                'application/json': {
                    schema: exports.viewPluginUpdateStorageVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const updateViewPluginStorage = async (tableId, viewId, pluginInstallId, storage) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.VIEW_PLUGIN_UPDATE_STORAGE, { tableId, viewId, pluginInstallId }), { storage });
};
exports.updateViewPluginStorage = updateViewPluginStorage;
