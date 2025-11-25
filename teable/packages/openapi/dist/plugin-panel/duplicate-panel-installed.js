"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicatePluginPanelInstalledPlugin = exports.duplicatePluginPanelInstalledPluginRoute = exports.duplicatePluginPanelInstalledPluginRoSchema = exports.DUPLICATE_PANEL_INSTALLED_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DUPLICATE_PANEL_INSTALLED_PLUGIN = '/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{installedId}/duplicate';
exports.duplicatePluginPanelInstalledPluginRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
});
exports.duplicatePluginPanelInstalledPluginRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_PANEL_INSTALLED_PLUGIN,
    description: 'Duplicate a dashboard installed plugin',
    summary: 'Duplicate a dashboard installed plugin',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the duplicated dashboard info.',
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
const duplicatePluginPanelInstalledPlugin = async (tableId, pluginPanelId, installedId, duplicatePluginPanelRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_PANEL_INSTALLED_PLUGIN, { tableId, pluginPanelId, installedId }), duplicatePluginPanelRo);
};
exports.duplicatePluginPanelInstalledPlugin = duplicatePluginPanelInstalledPlugin;
