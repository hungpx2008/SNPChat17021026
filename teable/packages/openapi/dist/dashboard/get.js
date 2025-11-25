"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = exports.GetDashboardRoute = exports.getDashboardVoSchema = exports.GET_DASHBOARD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_DASHBOARD = '/base/{baseId}/dashboard/{id}';
exports.getDashboardVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    layout: types_1.dashboardLayoutSchema.optional(),
    pluginMap: zod_1.z.record(zod_1.z.string(), types_1.dashboardPluginItemSchema).optional(),
});
exports.GetDashboardRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DASHBOARD,
    description: 'Get a dashboard by id',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about the dashboard.',
            content: {
                'application/json': {
                    schema: exports.getDashboardVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const getDashboard = async (baseId, id) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DASHBOARD, { baseId, id }));
};
exports.getDashboard = getDashboard;
