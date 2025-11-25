"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewOrder = exports.updateViewOrderRoute = exports.updateOrderRoSchema = exports.VIEW_ORDER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_ORDER = '/table/{tableId}/view/{viewId}/order';
exports.updateOrderRoSchema = zod_1.z.object({
    anchorId: zod_1.z.string(),
    position: zod_1.z.enum(['before', 'after']),
});
exports.updateViewOrderRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_ORDER,
    description: 'Update view order',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateOrderRoSchema,
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
const updateViewOrder = async (tableId, viewId, orderRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_ORDER, {
        tableId,
        viewId,
    }), orderRo);
};
exports.updateViewOrder = updateViewOrder;
