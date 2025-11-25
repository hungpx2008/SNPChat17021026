"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateBase = exports.DuplicateBaseRoute = exports.duplicateBaseRoSchema = exports.DUPLICATE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.DUPLICATE_BASE = '/base/duplicate';
exports.duplicateBaseRoSchema = zod_1.z.object({
    fromBaseId: zod_1.z.string().openapi({
        description: 'The base to duplicate',
    }),
    spaceId: zod_1.z.string().openapi({
        description: 'The space to duplicate the base to',
    }),
    withRecords: zod_1.z.boolean().optional().openapi({
        description: 'Whether to duplicate the records',
    }),
    name: zod_1.z.string().optional().openapi({
        description: 'The name of the duplicated base',
    }),
    baseId: zod_1.z.string().optional(),
});
exports.DuplicateBaseRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_BASE,
    description: 'duplicate a base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.duplicateBaseRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns information about a successfully duplicated base.',
            content: {
                'application/json': {
                    schema: create_1.createBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const duplicateBase = async (params) => {
    return axios_1.axios.post(exports.DUPLICATE_BASE, params);
};
exports.duplicateBase = duplicateBase;
