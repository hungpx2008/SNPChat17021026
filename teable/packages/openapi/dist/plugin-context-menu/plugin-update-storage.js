"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePluginContextMenuStorage = exports.pluginContextMenuUpdateStorageRoute = exports.pluginContextMenuUpdateStorageVoSchema = exports.pluginContextMenuUpdateStorageRoSchema = exports.PLUGIN_CONTEXT_MENU_UPDATE_STORAGE = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_UPDATE_STORAGE = '/table/{tableId}/plugin-context-menu/{pluginInstallId}/update-storage';
exports.pluginContextMenuUpdateStorageRoSchema = zod_1.z.object({
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.pluginContextMenuUpdateStorageVoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.pluginContextMenuUpdateStorageRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.PLUGIN_CONTEXT_MENU_UPDATE_STORAGE,
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuUpdateStorageRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Plugin context menu updated successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuUpdateStorageVoSchema,
                },
            },
        },
    },
    tags: ['plugin-context-menu'],
});
const updatePluginContextMenuStorage = async (tableId, pluginInstallId, ro) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_UPDATE_STORAGE, { tableId, pluginInstallId }), ro);
};
exports.updatePluginContextMenuStorage = updatePluginContextMenuStorage;
