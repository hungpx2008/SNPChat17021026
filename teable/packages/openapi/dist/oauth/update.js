"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthUpdate = exports.oauthUpdateRoute = exports.oauthUpdateVoSchema = exports.oauthUpdateRoSchema = exports.OAUTH_UPDATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
const get_1 = require("./get");
exports.OAUTH_UPDATE = '/oauth/client/{clientId}';
exports.oauthUpdateRoSchema = create_1.oauthCreateRoSchema;
exports.oauthUpdateVoSchema = get_1.oauthGetVoSchema;
exports.oauthUpdateRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.OAUTH_UPDATE,
    description: 'Update an OAuth application',
    request: {
        params: zod_1.z.object({
            clientId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.oauthUpdateVoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns the updated OAuth application',
            content: {
                'application/json': {
                    schema: exports.oauthUpdateVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const oauthUpdate = async (clientId, oauthRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.OAUTH_UPDATE, { clientId }), oauthRo);
};
exports.oauthUpdate = oauthUpdate;
