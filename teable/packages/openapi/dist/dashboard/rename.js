"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameDashboard = exports.RenameDashboardRoute = exports.renameDashboardVoSchema = exports.renameDashboardRoSchema = exports.RENAME_DASHBOARD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.RENAME_DASHBOARD = '/base/{baseId}/dashboard/{dashboardId}/rename';
exports.renameDashboardRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.renameDashboardVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.RenameDashboardRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.RENAME_DASHBOARD,
    description: 'Rename a dashboard by id',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            dashboardId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.renameDashboardRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the renamed dashboard.',
            content: {
                'application/json': {
                    schema: exports.renameDashboardVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const renameDashboard = async (baseId, dashboardId, name) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.RENAME_DASHBOARD, { baseId, dashboardId }), {
        name,
    });
};
exports.renameDashboard = renameDashboard;
