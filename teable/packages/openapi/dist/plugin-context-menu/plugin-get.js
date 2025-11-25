"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginContextMenu = exports.pluginContextMenuGetRoute = exports.pluginContextMenuGetVoSchema = exports.PLUGIN_CONTEXT_MENU_GET = void 0;
const axios_1 = require("../axios");
const types_1 = require("../plugin/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_GET = '/table/{tableId}/plugin-context-menu/{pluginInstallId}';
exports.pluginContextMenuGetVoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    tableId: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    positionId: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    config: types_1.pluginConfigSchema.optional(),
});
exports.pluginContextMenuGetRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_CONTEXT_MENU_GET,
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about the plugin context menu.',
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuGetVoSchema,
                },
            },
        },
    },
    tags: ['plugin-context-menu'],
});
const getPluginContextMenu = async (tableId, pluginInstallId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_GET, { tableId, pluginInstallId }));
};
exports.getPluginContextMenu = getPluginContextMenu;
