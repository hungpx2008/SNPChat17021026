"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpace = exports.UpdateSpaceRoute = exports.updateSpaceVoSchema = exports.updateSpaceRoSchema = exports.UPDATE_SPACE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.UPDATE_SPACE = '/space/{spaceId}';
exports.updateSpaceRoSchema = create_1.createSpaceRoSchema;
exports.updateSpaceVoSchema = create_1.createSpaceVoSchema;
exports.UpdateSpaceRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_SPACE,
    description: 'Update a space info',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateSpaceRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns information about a successfully updated space.',
            content: {
                'application/json': {
                    schema: exports.updateSpaceVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const updateSpace = async (params) => {
    const { spaceId, updateSpaceRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_SPACE, {
        spaceId,
    }), updateSpaceRo);
};
exports.updateSpace = updateSpace;
