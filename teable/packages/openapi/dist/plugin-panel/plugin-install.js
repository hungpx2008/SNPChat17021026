"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPluginPanel = exports.pluginPanelInstallRoute = exports.pluginPanelInstallVoSchema = exports.pluginPanelInstallRoSchema = exports.PLUGIN_PANEL_INSTALL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_INSTALL = '/table/{tableId}/plugin-panel/{pluginPanelId}/install';
exports.pluginPanelInstallRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    pluginId: zod_1.z.string(),
});
exports.pluginPanelInstallVoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
});
exports.pluginPanelInstallRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_PANEL_INSTALL,
    description: 'Install a plugin to a table plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelInstallRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Plugin installed successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelInstallVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const installPluginPanel = async (tableId, pluginPanelId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_INSTALL, { tableId, pluginPanelId }), ro);
};
exports.installPluginPanel = installPluginPanel;
