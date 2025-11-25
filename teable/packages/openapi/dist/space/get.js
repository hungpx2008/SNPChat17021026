"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceById = exports.GetSpaceRoute = exports.getSpaceVoSchema = exports.GET_SPACE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_SPACE = '/space/{spaceId}';
exports.getSpaceVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: core_1.roleSchema,
    organization: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
    })
        .optional(),
});
exports.GetSpaceRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SPACE,
    description: 'Get a space by spaceId',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns information about a space.',
            content: {
                'application/json': {
                    schema: exports.getSpaceVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const getSpaceById = async (spaceId) => {
    return await axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_SPACE, {
        spaceId,
    }));
};
exports.getSpaceById = getSpaceById;
