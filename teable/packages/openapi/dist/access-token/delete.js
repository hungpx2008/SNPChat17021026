"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccessToken = exports.deleteAccessRoute = exports.DELETE_ACCESS_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_ACCESS_TOKEN = '/access-token/{id}';
exports.deleteAccessRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_ACCESS_TOKEN,
    description: 'Delete access token',
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Access token deleted.',
        },
    },
    tags: ['access-token'],
});
const deleteAccessToken = async (id) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_ACCESS_TOKEN, { id }));
};
exports.deleteAccessToken = deleteAccessToken;
