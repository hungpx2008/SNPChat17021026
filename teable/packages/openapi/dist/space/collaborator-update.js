"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpaceCollaborator = exports.UpdateSpaceCollaborateRoute = exports.updateSpaceCollaborateRoSchema = exports.UPDATE_SPACE_COLLABORATE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.UPDATE_SPACE_COLLABORATE = '/space/{spaceId}/collaborators';
exports.updateSpaceCollaborateRoSchema = zod_1.z.object({
    principalId: zod_1.z.string(),
    principalType: zod_1.z.nativeEnum(types_1.PrincipalType),
    role: core_1.roleSchema,
});
exports.UpdateSpaceCollaborateRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_SPACE_COLLABORATE,
    description: 'Update a space collaborator',
    request: {
        params: zod_1.z.object({
            invitationId: zod_1.z.string(),
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateSpaceCollaborateRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['space'],
});
const updateSpaceCollaborator = async (params) => {
    const { spaceId, updateSpaceCollaborateRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_SPACE_COLLABORATE, {
        spaceId,
    }), updateSpaceCollaborateRo);
};
exports.updateSpaceCollaborator = updateSpaceCollaborator;
