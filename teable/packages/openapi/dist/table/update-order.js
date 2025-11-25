"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableOrder = exports.updateTableOrderRoute = exports.TABLE_ORDER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const update_order_1 = require("../view/update-order");
const zod_1 = require("../zod");
exports.TABLE_ORDER = '/base/{baseId}/table/{tableId}/order';
exports.updateTableOrderRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.TABLE_ORDER,
    summary: 'Update table order',
    description: 'Update the display order of a table in the base. This affects the order in which tables are shown in the UI.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: update_order_1.updateOrderRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Table order successfully updated.',
        },
    },
    tags: ['table'],
});
const updateTableOrder = async (baseId, tableId, orderRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.TABLE_ORDER, {
        baseId,
        tableId,
    }), orderRo);
};
exports.updateTableOrder = updateTableOrder;
