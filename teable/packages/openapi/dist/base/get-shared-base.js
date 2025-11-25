"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedBase = exports.GetSharedBaseRoute = exports.getSharedBaseVoSchema = exports.getSharedBaseItemSchema = exports.GET_SHARED_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.GET_SHARED_BASE = '/base/shared-base';
exports.getSharedBaseItemSchema = get_1.getBaseItemSchema.extend({
    spaceName: zod_1.z.string().optional(),
});
exports.getSharedBaseVoSchema = zod_1.z.array(exports.getSharedBaseItemSchema);
exports.GetSharedBaseRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SHARED_BASE,
    responses: {
        200: {
            description: 'Returns information about a shared base.',
            content: {
                'application/json': {
                    schema: exports.getSharedBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const getSharedBase = async () => {
    return axios_1.axios.get(exports.GET_SHARED_BASE);
};
exports.getSharedBase = getSharedBase;
