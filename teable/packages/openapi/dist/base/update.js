"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBase = exports.UpdateBaseRoute = exports.updateBaseVoSchema = exports.updateBaseRoSchema = exports.UPDATE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.UPDATE_BASE = '/base/{baseId}';
exports.updateBaseRoSchema = create_1.createBaseRoSchema.omit({ spaceId: true });
exports.updateBaseVoSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
    name: zod_1.z.string(),
    icon: zod_1.z.string().emoji().optional().nullable(),
});
exports.UpdateBaseRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_BASE,
    description: 'Update a base info',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateBaseRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns information about a successfully updated base.',
            content: {
                'application/json': {
                    schema: exports.updateBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const updateBase = async (params) => {
    const { baseId, updateBaseRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_BASE, {
        baseId,
    }), updateBaseRo);
};
exports.updateBase = updateBase;
