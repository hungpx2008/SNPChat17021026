"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePluginPanelStorage = exports.pluginPanelUpdateStorageRoute = exports.pluginPanelUpdateStorageVoSchema = exports.pluginPanelUpdateStorageRoSchema = exports.PLUGIN_PANEL_UPDATE_STORAGE = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_UPDATE_STORAGE = '/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/update-storage';
exports.pluginPanelUpdateStorageRoSchema = zod_1.z.object({
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.pluginPanelUpdateStorageVoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    pluginPanelId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.pluginPanelUpdateStorageRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_PANEL_UPDATE_STORAGE,
    description: 'Update storage of a plugin in a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelUpdateStorageRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Storage updated successfully.',
            content: {
                'application/json': {
                    schema: dashboard_1.pluginInstallStorageSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const updatePluginPanelStorage = async (tableId, pluginPanelId, pluginInstallId, ro) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_UPDATE_STORAGE, { tableId, pluginPanelId, pluginInstallId }), ro);
};
exports.updatePluginPanelStorage = updatePluginPanelStorage;
