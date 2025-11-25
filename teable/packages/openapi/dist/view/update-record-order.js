"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecordOrders = exports.updateRecordOrdersRoute = exports.RECORD_ORDER = exports.updateRecordOrdersRoSchema = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.updateRecordOrdersRoSchema = zod_1.z.object({
    anchorId: zod_1.z.string().openapi({
        description: 'Id of the record that you want to move other records around',
    }),
    position: zod_1.z.enum(['before', 'after']),
    recordIds: zod_1.z.string().array().max(1000).openapi({
        description: 'Ids of those records you want to move',
        maxLength: 1000,
    }),
});
exports.RECORD_ORDER = '/table/{tableId}/view/{viewId}/record-order';
exports.updateRecordOrdersRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.RECORD_ORDER,
    description: 'Update record order in view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateRecordOrdersRoSchema,
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
const updateRecordOrders = async (tableId, viewId, orderRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.RECORD_ORDER, {
        tableId,
        viewId,
    }), orderRo);
};
exports.updateRecordOrders = updateRecordOrders;
