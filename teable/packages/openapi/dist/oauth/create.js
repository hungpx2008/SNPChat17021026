"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthCreate = exports.oauthCreateRoute = exports.oauthCreateVoSchema = exports.oauthCreateRoSchema = exports.OAUTH_CREATE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.OAUTH_CREATE = '/oauth/client';
exports.oauthCreateRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    homepage: zod_1.z.string().url(),
    logo: zod_1.z.string().optional(),
    scopes: zod_1.z
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .array(zod_1.z.nativeEnum(core_1.OAUTH_ACTIONS))
        .transform((val) => (val ? Array.from(new Set(val)) : val))
        .optional(),
    redirectUris: zod_1.z.array(zod_1.z.string().url()).min(1),
});
exports.oauthCreateVoSchema = get_1.oauthGetVoSchema;
exports.oauthCreateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.OAUTH_CREATE,
    description: 'Create a new OAuth application',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.oauthCreateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns the created OAuth application',
            content: {
                'application/json': {
                    schema: exports.oauthCreateVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const oauthCreate = async (oauthRo) => {
    return axios_1.axios.post(exports.OAUTH_CREATE, oauthRo);
};
exports.oauthCreate = oauthCreate;
