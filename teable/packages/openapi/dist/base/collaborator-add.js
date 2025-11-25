"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBaseCollaborator = exports.AddBaseCollaboratorRoute = exports.addBaseCollaboratorRoSchema = exports.ADD_BASE_COLLABORATOR = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const collaborator_add_1 = require("../space/collaborator-add");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.ADD_BASE_COLLABORATOR = '/base/{baseId}/collaborator';
exports.addBaseCollaboratorRoSchema = zod_1.z.object({
    collaborators: zod_1.z.array(collaborator_add_1.addCollaboratorSchema),
    role: core_1.baseRolesSchema,
});
exports.AddBaseCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ADD_BASE_COLLABORATOR,
    description: 'Add a collaborator to a base',
    request: {
        params: zod_1.z.object({ baseId: zod_1.z.string() }),
        body: {
            content: {
                'application/json': {
                    schema: exports.addBaseCollaboratorRoSchema,
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
const addBaseCollaborator = async (baseId, collaborator) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.ADD_BASE_COLLABORATOR, { baseId }), collaborator);
};
exports.addBaseCollaborator = addBaseCollaborator;
