"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboard = exports.CreateDashboardRoute = exports.createDashboardVoSchema = exports.createDashboardRoSchema = exports.CREATE_DASHBOARD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_DASHBOARD = '/base/{baseId}/dashboard';
exports.createDashboardRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.createDashboardVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.CreateDashboardRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_DASHBOARD,
    description: 'Create a new dashboard',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.createDashboardRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about the created dashboard.',
            content: {
                'application/json': {
                    schema: exports.createDashboardVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const createDashboard = async (baseId, body) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_DASHBOARD, { baseId }), body);
};
exports.createDashboard = createDashboard;
