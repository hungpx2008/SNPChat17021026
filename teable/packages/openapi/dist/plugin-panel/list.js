"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPluginPanels = exports.pluginPanelListRoute = exports.pluginPanelListVoSchema = exports.PLUGIN_PANEL_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_LIST = '/table/{tableId}/plugin-panel';
exports.pluginPanelListVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
}));
exports.pluginPanelListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_PANEL_LIST,
    description: 'Get all plugin panels',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin panels retrieved successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelListVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const listPluginPanels = async (tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_LIST, { tableId }));
};
exports.listPluginPanels = listPluginPanels;
