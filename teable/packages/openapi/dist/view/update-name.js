"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewName = exports.updateViewNameRoute = exports.viewNameRoSchema = exports.VIEW_NAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_NAME = '/table/{tableId}/view/{viewId}/name';
exports.viewNameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.updateViewNameRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_NAME,
    description: 'Update view name',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewNameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully update.',
        },
    },
    tags: ['view'],
});
const updateViewName = async (tableId, viewId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_NAME, {
        tableId,
        viewId,
    }), data);
};
exports.updateViewName = updateViewName;
