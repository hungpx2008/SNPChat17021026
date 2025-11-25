"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardInstallPluginQuery = exports.GetDashboardInstallPluginQueryRoute = exports.getDashboardInstallPluginQueryRoSchema = exports.GET_DASHBOARD_INSTALL_PLUGIN_QUERY = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../../axios");
const base_1 = require("../../base");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.GET_DASHBOARD_INSTALL_PLUGIN_QUERY = '/plugin/chart/{pluginInstallId}/dashboard/{positionId}/query';
exports.getDashboardInstallPluginQueryRoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    cellFormat: zod_1.z
        .nativeEnum(core_1.CellFormat, {
        errorMap: () => ({ message: 'Error cellFormat, You should set it to "json" or "text"' }),
    })
        .optional(),
});
exports.GetDashboardInstallPluginQueryRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DASHBOARD_INSTALL_PLUGIN_QUERY,
    description: 'Get a dashboard install plugin query by id',
    request: {
        params: zod_1.z.object({
            pluginInstallId: zod_1.z.string(),
            positionId: zod_1.z.string(),
        }),
        query: exports.getDashboardInstallPluginQueryRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the dashboard install plugin query.',
            content: {
                'application/json': {
                    schema: base_1.baseQuerySchemaVo,
                },
            },
        },
    },
    tags: ['plugin', 'chart', 'dashboard'],
});
const getDashboardInstallPluginQuery = async (pluginInstallId, positionId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DASHBOARD_INSTALL_PLUGIN_QUERY, { pluginInstallId, positionId }), {
        params: query,
    });
};
exports.getDashboardInstallPluginQuery = getDashboardInstallPluginQuery;
