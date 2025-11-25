"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateDashboard = exports.duplicateDashboardRoute = exports.duplicateDashboardRoSchema = exports.DUPLICATE_DASHBOARD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DUPLICATE_DASHBOARD = '/base/{baseId}/dashboard/{id}/duplicate';
exports.duplicateDashboardRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
});
exports.duplicateDashboardRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_DASHBOARD,
    description: 'Duplicate a dashboard',
    summary: 'Duplicate a dashboard',
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
    tags: ['dashboard'],
});
const duplicateDashboard = async (baseId, id, duplicateDashboardRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_DASHBOARD, { baseId, id }), duplicateDashboardRo);
};
exports.duplicateDashboard = duplicateDashboard;
