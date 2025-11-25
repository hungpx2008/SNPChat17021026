"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginContextMenuStorage = exports.pluginContextMenuGetStorageRoute = exports.pluginContextMenuGetStorageVoSchema = exports.PLUGIN_CONTEXT_MENU_GET_STORAGE = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_GET_STORAGE = '/table/{tableId}/plugin-context-menu/{pluginInstallId}/storage';
exports.pluginContextMenuGetStorageVoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    tableId: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    storage: dashboard_1.pluginInstallStorageSchema,
});
exports.pluginContextMenuGetStorageRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_CONTEXT_MENU_GET_STORAGE,
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin context menu storage retrieved successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuGetStorageVoSchema,
                },
            },
        },
    },
    tags: ['plugin-context-menu'],
});
const getPluginContextMenuStorage = async (tableId, pluginInstallId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_GET_STORAGE, { tableId, pluginInstallId }));
};
exports.getPluginContextMenuStorage = getPluginContextMenuStorage;
