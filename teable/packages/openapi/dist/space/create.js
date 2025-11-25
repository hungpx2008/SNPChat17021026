"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpace = exports.CreateSpaceRoute = exports.createSpaceVoSchema = exports.createSpaceRoSchema = exports.CREATE_SPACE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_SPACE = '/space';
exports.createSpaceRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
});
exports.createSpaceVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.CreateSpaceRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_SPACE,
    description: 'Create a space',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createSpaceRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns information about a successfully created space.',
            content: {
                'application/json': {
                    schema: exports.createSpaceVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const createSpace = async (createSpaceRo) => {
    return axios_1.axios.post(exports.CREATE_SPACE, createSpaceRo);
};
exports.createSpace = createSpace;
