"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePin = exports.DeletePinRoute = exports.deletePinRoSchema = exports.DELETE_PIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.DELETE_PIN = '/pin';
exports.deletePinRoSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(types_1.PinType),
    id: zod_1.z.string(),
});
exports.DeletePinRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_PIN,
    description: 'Delete pin',
    request: {
        query: exports.deletePinRoSchema,
    },
    responses: {
        200: {
            description: 'Delete pin successfully',
        },
    },
    tags: ['pin'],
});
const deletePin = (data) => {
    return axios_1.axios.delete(exports.DELETE_PIN, {
        params: data,
    });
};
exports.deletePin = deletePin;
