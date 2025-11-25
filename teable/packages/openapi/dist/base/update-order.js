"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBaseOrder = exports.updateBaseOrderRoute = exports.BASE_ORDER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const update_order_1 = require("../view/update-order");
const zod_1 = require("../zod");
exports.BASE_ORDER = '/base/{baseId}/order';
exports.updateBaseOrderRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.BASE_ORDER,
    description: 'Update base order',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
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
            description: 'Successfully update.',
        },
    },
    tags: ['base'],
});
const updateBaseOrder = async (params) => {
    const { baseId, ...orderRo } = params;
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.BASE_ORDER, {
        baseId,
    }), orderRo);
};
exports.updateBaseOrder = updateBaseOrder;
