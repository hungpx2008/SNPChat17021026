"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewCollaborators = exports.ShareViewCollaboratorsRoute = exports.shareViewCollaboratorsVoSchema = exports.shareViewCollaboratorsRoSchema = exports.SHARE_VIEW_COLLABORATORS = void 0;
const axios_1 = require("../axios");
const types_1 = require("../space/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_COLLABORATORS = '/share/{shareId}/view/collaborators';
exports.shareViewCollaboratorsRoSchema = zod_1.z.object({
    fieldId: zod_1.z.string().optional(),
    skip: zod_1.z.coerce.number().optional(),
    take: zod_1.z.coerce.number().optional(),
    search: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(types_1.PrincipalType).optional(),
});
exports.shareViewCollaboratorsVoSchema = zod_1.z.array(zod_1.z.object({
    userId: zod_1.z.string(),
    userName: zod_1.z.string(),
    email: zod_1.z.string(),
    avatar: zod_1.z.string().nullable().optional(),
}));
exports.ShareViewCollaboratorsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_COLLABORATORS,
    description: 'View collaborators in a view with a user field selector.',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewCollaboratorsRoSchema,
    },
    responses: {
        200: {
            description: ' view collaborators',
            content: {
                'application/json': {
                    schema: exports.shareViewCollaboratorsVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewCollaborators = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_COLLABORATORS, { shareId }), {
        params: query,
    });
};
exports.getShareViewCollaborators = getShareViewCollaborators;
