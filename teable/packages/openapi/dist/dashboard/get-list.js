"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardList = exports.GetDashboardListRoute = exports.getDashboardListVoSchema = exports.GET_DASHBOARD_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_DASHBOARD_LIST = '/base/{baseId}/dashboard';
exports.getDashboardListVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
}));
exports.GetDashboardListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DASHBOARD_LIST,
    description: 'Get a list of dashboards in base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about the dashboards.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.getDashboardListVoSchema),
                },
            },
        },
    },
    tags: ['dashboard'],
});
const getDashboardList = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DASHBOARD_LIST, { baseId }));
};
exports.getDashboardList = getDashboardList;
