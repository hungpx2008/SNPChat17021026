"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccessToken = exports.updateAccessTokenRoute = exports.updateAccessTokenVoSchema = exports.updateAccessTokenRoSchema = exports.UPDATE_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_ACCESS_TOKEN = '/access-token/{id}';
exports.updateAccessTokenRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()),
    spaceIds: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    baseIds: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    hasFullAccess: zod_1.z.boolean().optional(),
});
exports.updateAccessTokenVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()),
    spaceIds: zod_1.z.array(zod_1.z.string()).optional(),
    baseIds: zod_1.z.array(zod_1.z.string()).optional(),
    hasFullAccess: zod_1.z.boolean().optional(),
});
exports.updateAccessTokenRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.UPDATE_ACCESS_TOKEN,
    description: 'Update access token',
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateAccessTokenRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns access token.',
            content: {
                'application/json': {
                    schema: exports.updateAccessTokenVoSchema,
                },
            },
        },
    },
    tags: ['access-token'],
});
const updateAccessToken = async (id, body) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.UPDATE_ACCESS_TOKEN, { id }), body);
};
exports.updateAccessToken = updateAccessToken;
