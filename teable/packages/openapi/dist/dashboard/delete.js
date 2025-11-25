"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDashboard = exports.DeleteDashboardRoute = exports.DELETE_DASHBOARD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_DASHBOARD = '/base/{baseId}/dashboard/{id}';
exports.DeleteDashboardRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_DASHBOARD,
    description: 'Delete a dashboard by id',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Dashboard deleted',
        },
    },
    tags: ['dashboard'],
});
const deleteDashboard = async (baseId, id) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_DASHBOARD, { baseId, id }));
};
exports.deleteDashboard = deleteDashboard;
