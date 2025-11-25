"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpaceCollaborator = exports.DeleteSpaceCollaboratorRoute = exports.deleteSpaceCollaboratorRoSchema = exports.DELETE_SPACE_COLLABORATOR = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.DELETE_SPACE_COLLABORATOR = '/space/{spaceId}/collaborators';
exports.deleteSpaceCollaboratorRoSchema = zod_1.z.object({
    principalId: zod_1.z.string(),
    principalType: zod_1.z.nativeEnum(types_1.PrincipalType),
});
exports.DeleteSpaceCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_SPACE_COLLABORATOR,
    description: 'Delete a collaborator',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        query: exports.deleteSpaceCollaboratorRoSchema,
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['space'],
});
const deleteSpaceCollaborator = (params) => {
    const { spaceId, deleteSpaceCollaboratorRo } = params;
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_SPACE_COLLABORATOR, { spaceId }), {
        params: deleteSpaceCollaboratorRo,
    });
};
exports.deleteSpaceCollaborator = deleteSpaceCollaborator;
