"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpaceCollaborator = exports.AddSpaceCollaboratorRoute = exports.addSpaceCollaboratorRoSchema = exports.addCollaboratorSchema = exports.ADD_SPACE_COLLABORATOR = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const types_1 = require("../space/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.ADD_SPACE_COLLABORATOR = '/space/{spaceId}/collaborator';
exports.addCollaboratorSchema = zod_1.z.object({
    principalId: zod_1.z.string(),
    principalType: zod_1.z.nativeEnum(types_1.PrincipalType),
});
exports.addSpaceCollaboratorRoSchema = zod_1.z.object({
    collaborators: zod_1.z.array(exports.addCollaboratorSchema),
    role: core_1.roleSchema,
});
exports.AddSpaceCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ADD_SPACE_COLLABORATOR,
    description: 'Add a collaborator to a space',
    request: {
        params: zod_1.z.object({ spaceId: zod_1.z.string() }),
        body: {
            content: {
                'application/json': {
                    schema: exports.addSpaceCollaboratorRoSchema,
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
const addSpaceCollaborator = async (spaceId, collaborator) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.ADD_SPACE_COLLABORATOR, { spaceId }), collaborator);
};
exports.addSpaceCollaborator = addSpaceCollaborator;
