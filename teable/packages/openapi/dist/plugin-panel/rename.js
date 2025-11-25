"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePluginPanel = exports.pluginPanelRenameRoute = exports.pluginPanelRenameVoSchema = exports.pluginPanelRenameRoSchema = exports.PLUGIN_PANEL_RENAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_RENAME = '/table/{tableId}/plugin-panel/{pluginPanelId}/rename';
exports.pluginPanelRenameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.pluginPanelRenameVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.pluginPanelRenameRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_PANEL_RENAME,
    description: 'Rename a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelRenameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Plugin panel updated successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelRenameRoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const renamePluginPanel = async (tableId, pluginPanelId, ro) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_RENAME, { tableId, pluginPanelId }), ro);
};
exports.renamePluginPanel = renamePluginPanel;
