"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseById = exports.GetBaseRoute = exports.getBaseVoSchema = exports.getBaseItemSchema = exports.GET_BASE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const types_1 = require("../space/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_BASE = '/base/{baseId}';
exports.getBaseItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    spaceId: zod_1.z.string(),
    icon: zod_1.z.string().nullable(),
    role: core_1.roleSchema,
    collaboratorType: zod_1.z.nativeEnum(types_1.CollaboratorType).optional(),
    restrictedAuthority: zod_1.z.boolean().optional(),
});
exports.getBaseVoSchema = exports.getBaseItemSchema;
exports.GetBaseRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_BASE,
    description: 'Get a base by baseId',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns information about a base.',
            content: {
                'application/json': {
                    schema: exports.getBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const getBaseById = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_BASE, {
        baseId,
    }));
};
exports.getBaseById = getBaseById;
