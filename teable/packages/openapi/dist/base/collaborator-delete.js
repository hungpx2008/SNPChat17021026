"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBaseCollaborator = exports.DeleteBaseCollaboratorRoute = exports.deleteBaseCollaboratorRoSchema = exports.DELETE_BASE_COLLABORATOR = void 0;
const axios_1 = require("../axios");
const space_1 = require("../space");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_BASE_COLLABORATOR = '/base/{baseId}/collaborators';
exports.deleteBaseCollaboratorRoSchema = space_1.deleteSpaceCollaboratorRoSchema;
exports.DeleteBaseCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_BASE_COLLABORATOR,
    description: 'Delete a base collaborators',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: exports.deleteBaseCollaboratorRoSchema,
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['base'],
});
const deleteBaseCollaborator = (params) => {
    const { baseId, deleteBaseCollaboratorRo } = params;
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_BASE_COLLABORATOR, { baseId }), {
        params: deleteBaseCollaboratorRo,
    });
};
exports.deleteBaseCollaborator = deleteBaseCollaborator;
