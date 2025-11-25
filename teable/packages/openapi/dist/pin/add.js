"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPin = exports.AddPinRoute = exports.addPinRoSchema = exports.ADD_PIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.ADD_PIN = '/pin/';
exports.addPinRoSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(types_1.PinType),
    id: zod_1.z.string(),
});
exports.AddPinRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ADD_PIN,
    description: 'Add pin',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.addPinRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Add pin successfully',
        },
    },
    tags: ['pin'],
});
const addPin = (data) => {
    return axios_1.axios.post(exports.ADD_PIN, data);
};
exports.addPin = addPin;
