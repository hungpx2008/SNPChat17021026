"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLayoutDashboard = exports.UpdateLayoutDashboardRoute = exports.updateLayoutDashboardVoSchema = exports.updateLayoutDashboardRoSchema = exports.UPDATE_LAYOUT_DASHBOARD = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const types_1 = require("./types");
exports.UPDATE_LAYOUT_DASHBOARD = '/base/{baseId}/dashboard/{id}/layout';
exports.updateLayoutDashboardRoSchema = zod_1.z.object({
    layout: types_1.dashboardLayoutSchema,
});
exports.updateLayoutDashboardVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    layout: types_1.dashboardLayoutSchema,
});
exports.UpdateLayoutDashboardRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_LAYOUT_DASHBOARD,
    description: 'Update a dashboard layout by id',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateLayoutDashboardRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the updated dashboard layout.',
            content: {
                'application/json': {
                    schema: exports.updateLayoutDashboardVoSchema,
                },
            },
        },
    },
    tags: ['dashboard'],
});
const updateLayoutDashboard = async (baseId, id, layout) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_LAYOUT_DASHBOARD, { baseId, id }), { layout });
};
exports.updateLayoutDashboard = updateLayoutDashboard;
