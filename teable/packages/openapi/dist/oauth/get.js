"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthGet = exports.oauthGetRoute = exports.oauthGetVoSchema = exports.oauthGetRoSchema = exports.OAUTH_GET = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OAUTH_GET = '/oauth/client/{clientId}';
exports.oauthGetRoSchema = zod_1.z.object({
    clientId: zod_1.z.string(),
});
exports.oauthGetVoSchema = zod_1.z.object({
    clientId: zod_1.z.string(),
    name: zod_1.z.string(),
    secrets: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        secret: zod_1.z.string(),
        lastUsedTime: zod_1.z.string().optional(),
    }))
        .optional(),
    scopes: zod_1.z.array(zod_1.z.string()).optional(),
    logo: zod_1.z.string().url().optional(),
    homepage: zod_1.z.string().url(),
    redirectUris: zod_1.z.array(zod_1.z.string().url()),
});
exports.oauthGetRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.OAUTH_GET,
    description: 'Get the OAuth application',
    request: {
        params: zod_1.z.object({
            clientId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the OAuth application',
            content: {
                'application/json': {
                    schema: exports.oauthGetVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const oauthGet = async (clientId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.OAUTH_GET, { clientId }));
};
exports.oauthGet = oauthGet;
