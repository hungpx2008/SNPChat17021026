"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccessToken = exports.listAccessRoute = exports.listAccessTokenVoSchema = exports.LIST_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.LIST_ACCESS_TOKEN = '/access-token';
exports.listAccessTokenVoSchema = zod_1.z.array(types_1.accessTokenItemSchema);
exports.listAccessRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.LIST_ACCESS_TOKEN,
    description: 'List access token',
    request: {},
    responses: {
        200: {
            description: 'Returns access token.',
            content: {
                'application/json': {
                    schema: exports.listAccessTokenVoSchema,
                },
            },
        },
    },
    tags: ['access-token'],
});
const listAccessToken = async () => {
    return axios_1.axios.get(exports.LIST_ACCESS_TOKEN);
};
exports.listAccessToken = listAccessToken;
