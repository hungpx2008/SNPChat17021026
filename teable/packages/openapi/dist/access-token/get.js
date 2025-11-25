"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.getAccessRoute = exports.getAccessTokenVoSchema = exports.GET_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_ACCESS_TOKEN = '/access-token/{id}';
exports.getAccessTokenVoSchema = types_1.accessTokenItemSchema;
exports.getAccessRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_ACCESS_TOKEN,
    description: 'Get access token',
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns access token.',
            content: {
                'application/json': {
                    schema: exports.getAccessTokenVoSchema,
                },
            },
        },
    },
    tags: ['access-token'],
});
const getAccessToken = async (id) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_ACCESS_TOKEN, { id }));
};
exports.getAccessToken = getAccessToken;
