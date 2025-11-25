"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = exports.createAccessRoute = exports.createAccessTokenVoSchema = exports.createAccessTokenRoSchema = exports.CREATE_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_ACCESS_TOKEN = '/access-token';
const isValidDateString = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};
exports.createAccessTokenRoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()).min(1),
    spaceIds: zod_1.z.array(zod_1.z.string()).min(1).nullable().optional(),
    baseIds: zod_1.z.array(zod_1.z.string()).min(1).nullable().optional(),
    hasFullAccess: zod_1.z.boolean().optional(),
    expiredTime: zod_1.z
        .string()
        .refine(isValidDateString, {
        message: 'expiredTime: Invalid Date ',
    })
        .openapi({ example: '2024-03-25' }),
});
exports.createAccessTokenVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()),
    spaceIds: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    baseIds: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    hasFullAccess: zod_1.z.boolean().optional(),
    expiredTime: zod_1.z.string(),
    token: zod_1.z.string(),
    createdTime: zod_1.z.string(),
    lastUsedTime: zod_1.z.string(),
});
exports.createAccessRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_ACCESS_TOKEN,
    description: 'Create access token',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createAccessTokenRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns access token.',
            content: {
                'application/json': {
                    schema: exports.createAccessTokenVoSchema,
                },
            },
        },
    },
    tags: ['access-token'],
});
const createAccessToken = async (body) => {
    return axios_1.axios.post(exports.CREATE_ACCESS_TOKEN, body);
};
exports.createAccessToken = createAccessToken;
