"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginRefreshToken = exports.PluginRefreshTokenRoute = exports.pluginRefreshTokenVoSchema = exports.pluginRefreshTokenRoSchema = exports.PLUGIN_REFRESH_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_token_1 = require("./get-token");
exports.PLUGIN_REFRESH_TOKEN = '/plugin/{pluginId}/refreshToken';
exports.pluginRefreshTokenRoSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
    secret: zod_1.z.string(),
});
exports.pluginRefreshTokenVoSchema = get_token_1.pluginGetTokenVoSchema;
exports.PluginRefreshTokenRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_REFRESH_TOKEN,
    description: 'Refresh a token',
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginRefreshTokenRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns token.',
            content: {
                'application/json': {
                    schema: exports.pluginRefreshTokenVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const pluginRefreshToken = async (pluginId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_REFRESH_TOKEN, { pluginId }), ro);
};
exports.pluginRefreshToken = pluginRefreshToken;
