"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseCollaboratorList = exports.ListBaseCollaboratorRoute = exports.listBaseCollaboratorVoSchema = exports.listBaseCollaboratorRoSchema = exports.itemBaseCollaboratorSchema = exports.BASE_COLLABORATE_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const types_1 = require("../space/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.BASE_COLLABORATE_LIST = '/base/{baseId}/collaborators';
exports.itemBaseCollaboratorSchema = types_1.collaboratorItem;
exports.listBaseCollaboratorRoSchema = zod_1.z.object({
    includeSystem: zod_1.z.coerce.boolean().optional(),
    skip: zod_1.z.coerce.number().optional(),
    take: zod_1.z.coerce.number().optional(),
    search: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(types_1.PrincipalType).optional(),
    role: core_1.roleSchema.array().optional(),
});
exports.listBaseCollaboratorVoSchema = zod_1.z.object({
    collaborators: zod_1.z.array(exports.itemBaseCollaboratorSchema),
    total: zod_1.z.number(),
});
exports.ListBaseCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.BASE_COLLABORATE_LIST,
    description: 'List a base collaborator',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: exports.listBaseCollaboratorRoSchema,
    },
    responses: {
        200: {
            description: 'Successful response, return base collaborator list.',
            content: {
                'application/json': {
                    schema: exports.listBaseCollaboratorVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const getBaseCollaboratorList = async (baseId, options) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.BASE_COLLABORATE_LIST, {
        baseId,
    }), { params: options });
};
exports.getBaseCollaboratorList = getBaseCollaboratorList;
