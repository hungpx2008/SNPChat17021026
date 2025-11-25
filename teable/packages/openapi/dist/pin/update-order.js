"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePinOrder = exports.UpdatePinOrderRoute = exports.updatePinOrderRoSchema = exports.UPDATE_PIN_ORDER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.UPDATE_PIN_ORDER = '/pin/order';
exports.updatePinOrderRoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.nativeEnum(types_1.PinType),
    anchorId: zod_1.z.string(),
    anchorType: zod_1.z.nativeEnum(types_1.PinType),
    position: zod_1.z.enum(['before', 'after']),
});
exports.UpdatePinOrderRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.UPDATE_PIN_ORDER,
    description: 'Update  pin order',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.updatePinOrderRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Update  pin order successfully',
        },
    },
    tags: ['pin'],
});
const updatePinOrder = (data) => {
    return axios_1.axios.put(exports.UPDATE_PIN_ORDER, data);
};
exports.updatePinOrder = updatePinOrder;
