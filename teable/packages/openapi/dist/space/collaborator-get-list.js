"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceCollaboratorList = exports.ListSpaceCollaboratorRoute = exports.listSpaceCollaboratorVoSchema = exports.listSpaceCollaboratorRoSchema = exports.SPACE_COLLABORATE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.SPACE_COLLABORATE_LIST = '/space/{spaceId}/collaborators';
exports.listSpaceCollaboratorRoSchema = zod_1.z.object({
    includeSystem: zod_1.z.coerce.boolean().optional(),
    includeBase: zod_1.z.coerce.boolean().optional(),
    skip: zod_1.z.coerce.number().optional(),
    take: zod_1.z.coerce.number().optional(),
    search: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(types_1.PrincipalType).optional(),
    orderBy: zod_1.z.enum(['desc', 'asc']).optional(),
});
exports.listSpaceCollaboratorVoSchema = zod_1.z.object({
    collaborators: zod_1.z.array(types_1.collaboratorItem),
    uniqTotal: zod_1.z.number(),
    total: zod_1.z.number(),
});
exports.ListSpaceCollaboratorRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SPACE_COLLABORATE_LIST,
    description: 'List a space collaborator',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        query: exports.listSpaceCollaboratorRoSchema,
    },
    responses: {
        200: {
            description: 'Successful response, return space collaborator list.',
            content: {
                'application/json': {
                    schema: exports.listSpaceCollaboratorVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const getSpaceCollaboratorList = async (spaceId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SPACE_COLLABORATE_LIST, {
        spaceId,
    }), {
        params: query,
    });
};
exports.getSpaceCollaboratorList = getSpaceCollaboratorList;
