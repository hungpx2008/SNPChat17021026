"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginPanelInstallPluginQuery = exports.GetPluginPanelInstallPluginQueryRoute = exports.getPluginPanelInstallPluginQueryRoSchema = exports.GET_PLUGIN_PANEL_INSTALL_PLUGIN_QUERY = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../../axios");
const base_1 = require("../../base");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.GET_PLUGIN_PANEL_INSTALL_PLUGIN_QUERY = '/plugin/chart/{pluginInstallId}/plugin-panel/{positionId}/query';
exports.getPluginPanelInstallPluginQueryRoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    cellFormat: zod_1.z
        .nativeEnum(core_1.CellFormat, {
        errorMap: () => ({ message: 'Error cellFormat, You should set it to "json" or "text"' }),
    })
        .optional(),
});
exports.GetPluginPanelInstallPluginQueryRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PLUGIN_PANEL_INSTALL_PLUGIN_QUERY,
    description: 'Get a plugin panel install plugin query by id',
    request: {
        params: zod_1.z.object({
            pluginInstallId: zod_1.z.string(),
            positionId: zod_1.z.string(),
        }),
        query: exports.getPluginPanelInstallPluginQueryRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the plugin panel install plugin query.',
            content: {
                'application/json': {
                    schema: base_1.baseQuerySchemaVo,
                },
            },
        },
    },
    tags: ['plugin', 'chart', 'plugin-panel'],
});
const getPluginPanelInstallPluginQuery = async (pluginInstallId, positionId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_PLUGIN_PANEL_INSTALL_PLUGIN_QUERY, { pluginInstallId, positionId }), {
        params: query,
    });
};
exports.getPluginPanelInstallPluginQuery = getPluginPanelInstallPluginQuery;
