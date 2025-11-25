"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBase = exports.CreateBaseRoute = exports.createBaseVoSchema = exports.createBaseRoSchema = exports.CREATE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_BASE = '/base';
exports.createBaseRoSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.createBaseVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    spaceId: zod_1.z.string(),
});
exports.CreateBaseRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_BASE,
    description: 'Create a base',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createBaseRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns information about a successfully created base.',
            content: {
                'application/json': {
                    schema: exports.createBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const createBase = async (createBaseRo) => {
    return axios_1.axios.post(exports.CREATE_BASE, createBaseRo);
};
exports.createBase = createBase;
