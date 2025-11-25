"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthGetList = exports.oauthGetListRoute = exports.oauthGetListVoSchema = exports.OAUTH_GET_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OAUTH_GET_LIST = '/oauth/client';
exports.oauthGetListVoSchema = zod_1.z.array(zod_1.z.object({
    clientId: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    logo: zod_1.z.string().url().optional(),
    homepage: zod_1.z.string().url(),
}));
exports.oauthGetListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.OAUTH_GET_LIST,
    description: 'Get the list of OAuth applications',
    responses: {
        200: {
            description: 'Returns the list of OAuth applications',
            content: {
                'application/json': {
                    schema: exports.oauthGetListVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const oauthGetList = async () => {
    return axios_1.axios.get(exports.OAUTH_GET_LIST);
};
exports.oauthGetList = oauthGetList;
