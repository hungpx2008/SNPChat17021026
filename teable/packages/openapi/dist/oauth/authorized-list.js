"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizedList = exports.authorizedListRoute = exports.authorizedVoSchema = exports.AUTHORIZED_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.AUTHORIZED_LIST = '/oauth/client/authorized/list';
exports.authorizedVoSchema = zod_1.z.object({
    clientId: zod_1.z.string(),
    name: zod_1.z.string(),
    homepage: zod_1.z.string().url(),
    logo: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()).optional(),
    lastUsedTime: zod_1.z.string().optional(),
    createdUser: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
    }),
});
exports.authorizedListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.AUTHORIZED_LIST,
    description: 'Get the list of authorized applications',
    responses: {
        200: {
            description: 'Returns the list of authorized applications',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.authorizedVoSchema),
                },
            },
        },
    },
    tags: ['oauth'],
});
const getAuthorizedList = async () => {
    return axios_1.axios.get(exports.AUTHORIZED_LIST);
};
exports.getAuthorizedList = getAuthorizedList;
