"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewInstallPlugin = exports.GetViewInstallPluginRoute = exports.getViewInstallPluginVoSchema = exports.GET_VIEW_INSTALL_PLUGIN = void 0;
const axios_1 = require("../axios");
const dashboard_1 = require("../dashboard");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_VIEW_INSTALL_PLUGIN = '/table/{tableId}/view/{viewId}/plugin';
exports.getViewInstallPluginVoSchema = zod_1.z.object({
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    baseId: zod_1.z.string(),
    name: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    storage: dashboard_1.pluginInstallStorageSchema.optional(),
});
exports.GetViewInstallPluginRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_VIEW_INSTALL_PLUGIN,
    description: 'Get a view install plugin by id',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about the view install plugin.',
            content: {
                'application/json': {
                    schema: exports.getViewInstallPluginVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const getViewInstallPlugin = async (tableId, viewId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_VIEW_INSTALL_PLUGIN, { tableId, viewId }));
};
exports.getViewInstallPlugin = getViewInstallPlugin;
