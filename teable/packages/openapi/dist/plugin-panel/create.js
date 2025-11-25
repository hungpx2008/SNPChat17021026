"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPluginPanel = exports.pluginPanelCreateRoute = exports.pluginPanelCreateVoSchema = exports.pluginPanelCreateRoSchema = exports.PLUGIN_PANEL_CREATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_CREATE = '/table/{tableId}/plugin-panel';
exports.pluginPanelCreateRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.pluginPanelCreateVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.pluginPanelCreateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_PANEL_CREATE,
    description: 'Create a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelCreateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Plugin panel created successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelCreateVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const createPluginPanel = async (tableId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_CREATE, { tableId }), ro);
};
exports.createPluginPanel = createPluginPanel;
