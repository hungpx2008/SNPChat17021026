"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewLocked = exports.updateViewLockedRoute = exports.viewLockedRoSchema = exports.VIEW_LOCKED = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_LOCKED = '/table/{tableId}/view/{viewId}/locked';
exports.viewLockedRoSchema = zod_1.z.object({
    isLocked: zod_1.z.boolean().optional(),
});
exports.updateViewLockedRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_LOCKED,
    description: 'Update the locked status of the view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewLockedRoSchema,
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
const updateViewLocked = async (tableId, viewId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_LOCKED, {
        tableId,
        viewId,
    }), data);
};
exports.updateViewLocked = updateViewLocked;
