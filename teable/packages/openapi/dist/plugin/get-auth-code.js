"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginGetAuthCode = exports.pluginGetAuthCodeRouter = exports.pluginGetAuthCodeRoSchema = exports.PLUGIN_GET_AUTH_CODE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_GET_AUTH_CODE = '/plugin/{pluginId}/authCode';
exports.pluginGetAuthCodeRoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
});
exports.pluginGetAuthCodeRouter = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_GET_AUTH_CODE,
    description: 'Get an auth code',
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginGetAuthCodeRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns auth code.',
            content: {
                'application/json': {
                    schema: zod_1.z.object({
                        code: zod_1.z.string(),
                    }),
                },
            },
        },
    },
    tags: ['plugin'],
});
const pluginGetAuthCode = async (pluginId, baseId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_GET_AUTH_CODE, { pluginId }), { baseId });
};
exports.pluginGetAuthCode = pluginGetAuthCode;
