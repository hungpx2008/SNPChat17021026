"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBaseCollaborator = exports.UpdateBaseCollaborateRoute = exports.updateBaseCollaborateRoSchema = exports.UPDATE_BASE_COLLABORATE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const types_1 = require("../space/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_BASE_COLLABORATE = '/base/{baseId}/collaborators';
exports.updateBaseCollaborateRoSchema = zod_1.z.object({
    principalId: zod_1.z.string(),
    principalType: zod_1.z.nativeEnum(types_1.PrincipalType),
    role: core_1.baseRolesSchema,
});
exports.UpdateBaseCollaborateRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_BASE_COLLABORATE,
    description: 'Update a base collaborator',
    request: {
        params: zod_1.z.object({
            invitationId: zod_1.z.string(),
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateBaseCollaborateRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['base'],
});
const updateBaseCollaborator = async (params) => {
    const { baseId, updateBaseCollaborateRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_BASE_COLLABORATE, {
        baseId,
    }), updateBaseCollaborateRo);
};
exports.updateBaseCollaborator = updateBaseCollaborator;
