"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePluginPanelLayout = exports.pluginPanelUpdateLayoutRoute = exports.pluginPanelUpdateLayoutVoSchema = exports.pluginPanelUpdateLayoutRoSchema = exports.PLUGIN_PANEL_UPDATE_LAYOUT = void 0;
const axios_1 = require("../axios");
const types_1 = require("../dashboard/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_PANEL_UPDATE_LAYOUT = '/table/{tableId}/plugin-panel/{pluginPanelId}/layout';
exports.pluginPanelUpdateLayoutRoSchema = zod_1.z.object({
    layout: types_1.dashboardLayoutSchema,
});
exports.pluginPanelUpdateLayoutVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    layout: types_1.dashboardLayoutSchema,
});
exports.pluginPanelUpdateLayoutRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_PANEL_UPDATE_LAYOUT,
    description: 'Update the layout of a plugin panel',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginPanelId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginPanelUpdateLayoutRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'The layout of the plugin panel was updated successfully.',
            content: {
                'application/json': {
                    schema: exports.pluginPanelUpdateLayoutVoSchema,
                },
            },
        },
    },
    tags: ['plugin-panel'],
});
const updatePluginPanelLayout = async (tableId, pluginPanelId, ro) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_PANEL_UPDATE_LAYOUT, { tableId, pluginPanelId }), ro);
};
exports.updatePluginPanelLayout = updatePluginPanelLayout;
