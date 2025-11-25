"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCollaborators = exports.ListBaseCollaboratorUserRoute = exports.listBaseCollaboratorUserVoSchema = exports.itemBaseCollaboratorUserSchema = exports.listBaseCollaboratorUserRoSchema = exports.BASE_COLLABORATE_LIST_USER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.BASE_COLLABORATE_LIST_USER = '/base/{baseId}/collaborators/users';
exports.listBaseCollaboratorUserRoSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    skip: zod_1.z.coerce.number().optional(),
    take: zod_1.z.coerce.number().optional(),
    includeSystem: zod_1.z.coerce.boolean().optional(),
    orderBy: zod_1.z.enum(['desc', 'asc']).optional(),
});
exports.itemBaseCollaboratorUserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    avatar: zod_1.z.string().nullable().optional(),
});
exports.listBaseCollaboratorUserVoSchema = zod_1.z.object({
    users: zod_1.z.array(exports.itemBaseCollaboratorUserSchema),
    total: zod_1.z.number(),
});
exports.ListBaseCollaboratorUserRoute = (0, utils_1.registerRoute)({
    method: 'get',
    summary: 'Get base collaborator user list',
    description: 'Get base collaborator user list',
    path: exports.BASE_COLLABORATE_LIST_USER,
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: exports.listBaseCollaboratorUserRoSchema,
    },
    responses: {
        200: {
            description: 'Successful response, return base collaborator user list.',
            content: {
                'application/json': {
                    schema: exports.listBaseCollaboratorUserVoSchema,
                },
            },
        },
    },
});
const getUserCollaborators = async (baseId, options) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.BASE_COLLABORATE_LIST_USER, { baseId }), {
        params: options,
    });
};
exports.getUserCollaborators = getUserCollaborators;
