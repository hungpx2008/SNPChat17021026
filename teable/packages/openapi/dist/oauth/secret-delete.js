"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOAuthSecret = exports.deleteOauthSecretRoute = exports.OAUTH_SECRET_DELETE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OAUTH_SECRET_DELETE = '/oauth/client/{clientId}/secret/{secretId}';
exports.deleteOauthSecretRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.OAUTH_SECRET_DELETE,
    description: 'Delete the OAuth secret',
    request: {
        params: zod_1.z.object({
            secretId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'OAuth secret deleted',
        },
    },
    tags: ['oauth'],
});
const deleteOAuthSecret = async (clientId, secretId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.OAUTH_SECRET_DELETE, { clientId, secretId }));
};
exports.deleteOAuthSecret = deleteOAuthSecret;
