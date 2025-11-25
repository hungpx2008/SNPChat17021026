"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthDelete = exports.deleteOauthRoute = exports.OAUTH_DELETE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OAUTH_DELETE = '/oauth/client/{clientId}';
exports.deleteOauthRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.OAUTH_DELETE,
    description: 'Delete an OAuth application',
    request: {
        params: zod_1.z.object({
            clientId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'OAuth application deleted',
        },
    },
    tags: ['oauth'],
});
const oauthDelete = async (clientId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.OAUTH_DELETE, { clientId }));
};
exports.oauthDelete = oauthDelete;
