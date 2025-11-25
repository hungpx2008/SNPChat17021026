"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOAuthSecret = exports.generateOAuthSecretRoute = exports.generateOAuthSecretVoSchema = exports.OAUTH_SECRET_GENERATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OAUTH_SECRET_GENERATE = '/oauth/client/{clientId}/secret';
exports.generateOAuthSecretVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    secret: zod_1.z.string(),
    maskedSecret: zod_1.z.string(),
    lastUsedTime: zod_1.z.string().optional(),
});
exports.generateOAuthSecretRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.OAUTH_SECRET_GENERATE,
    description: 'Generate a new OAuth secret',
    request: {
        params: zod_1.z.object({
            clientId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns the generated OAuth secret',
            content: {
                'application/json': {
                    schema: exports.generateOAuthSecretVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const generateOAuthSecret = async (clientId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.OAUTH_SECRET_GENERATE, { clientId }));
};
exports.generateOAuthSecret = generateOAuthSecret;
