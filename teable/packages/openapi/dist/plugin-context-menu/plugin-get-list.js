"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginContextMenuList = exports.getPluginContextMenuListRoute = exports.pluginContextMenuGetItemSchema = exports.PLUGIN_CONTEXT_MENU_GET_LIST = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.PLUGIN_CONTEXT_MENU_GET_LIST = '/table/{tableId}/plugin-context-menu';
exports.pluginContextMenuGetItemSchema = zod_1.z.object({
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    logo: zod_1.z.string(),
    order: zod_1.z.number(),
});
exports.getPluginContextMenuListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_CONTEXT_MENU_GET_LIST,
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns a list of plugins',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.pluginContextMenuGetItemSchema),
                },
            },
        },
    },
    tags: ['plugin-context-menu'],
});
const getPluginContextMenuList = async (tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_GET_LIST, { tableId }));
};
exports.getPluginContextMenuList = getPluginContextMenuList;
