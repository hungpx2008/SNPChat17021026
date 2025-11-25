"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicatePluginPanel = exports.duplicatePluginPanelRoute = exports.duplicatePluginPanelRoSchema = exports.PLUGIN_PlUGIN_PANEL_DUPLICATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PlUGIN_PANEL_DUPLICATE = '/table/{tableId}/plugin-panel/{pluginPanelId}/duplicate';
exports.duplicatePluginPanelRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
});
exports.duplicatePluginPanelRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_PlUGIN_PANEL_DUPLICATE,
    description: 'Duplicate a plugin panel',
    summary: 'Duplicate a plugin panel',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the duplicated plugin panel info.',
            content: {
                'application/json': {
                    schema: zod_1.z.object({
                        id: zod_1.z.string(),
                        name: zod_1.z.string(),
                    }),
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const duplicatePluginPanel = async (tableId, pluginPanelId, duplicatePluginPanelRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_PlUGIN_PANEL_DUPLICATE, { tableId, pluginPanelId }), duplicatePluginPanelRo);
};
exports.duplicatePluginPanel = duplicatePluginPanel;
