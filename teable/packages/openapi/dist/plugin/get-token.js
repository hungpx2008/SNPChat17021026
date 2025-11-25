"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginGetToken = exports.PluginGetTokenRoute = exports.pluginGetTokenVoSchema = exports.pluginGetTokenRoSchema = exports.PLUGIN_GET_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_GET_TOKEN = '/plugin/{pluginId}/token';
exports.pluginGetTokenRoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    secret: zod_1.z.string(),
    scopes: zod_1.z.array(zod_1.z.string()),
    authCode: zod_1.z.string(),
});
exports.pluginGetTokenVoSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    scopes: zod_1.z.array(zod_1.z.string()),
    expiresIn: zod_1.z.number(),
    refreshExpiresIn: zod_1.z.number(),
});
exports.PluginGetTokenRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_GET_TOKEN,
    description: 'Get a token',
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginGetTokenRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns token.',
            content: {
                'application/json': {
                    schema: exports.pluginGetTokenVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const pluginGetToken = async (pluginId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_GET_TOKEN, { pluginId }), ro);
};
exports.pluginGetToken = pluginGetToken;
