"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.accessTokenRoute = exports.refreshAccessTokenVoSchema = exports.refreshAccessTokenRoSchema = exports.REFRESH_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.REFRESH_ACCESS_TOKEN = '/access-token/{id}/refresh';
exports.refreshAccessTokenRoSchema = zod_1.z
    .object({
    expiredTime: zod_1.z.string(),
})
    .optional();
exports.refreshAccessTokenVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    expiredTime: zod_1.z.string(),
    token: zod_1.z.string(),
});
exports.accessTokenRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.REFRESH_ACCESS_TOKEN,
    description: 'Refresh access token',
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.refreshAccessTokenRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns access token.',
            content: {
                'application/json': {
                    schema: exports.refreshAccessTokenVoSchema,
                },
            },
        },
    },
    tags: ['access-token'],
});
const refreshAccessToken = async (id, body) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.REFRESH_ACCESS_TOKEN, { id }), body);
};
exports.refreshAccessToken = refreshAccessToken;
