"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugin = exports.GetPluginRoute = exports.getPluginVoSchema = exports.getPluginRoSchema = exports.GET_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_PLUGIN = '/plugin/{pluginId}';
exports.getPluginRoSchema = zod_1.z.object({
    pluginId: zod_1.z.string(),
});
exports.getPluginVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    detailDesc: zod_1.z.string().optional(),
    logo: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    helpUrl: zod_1.z.string().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)),
    i18n: types_1.pluginI18nSchema.optional(),
    config: types_1.pluginConfigSchema.optional(),
    secret: zod_1.z.string(),
    status: zod_1.z.nativeEnum(types_1.PluginStatus),
    pluginUser: types_1.pluginUserSchema,
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string(),
});
exports.GetPluginRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PLUGIN,
    description: 'Get a plugin',
    request: {
        params: exports.getPluginRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the plugin.',
            content: {
                'application/json': {
                    schema: exports.getPluginVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const getPlugin = async (pluginId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_PLUGIN, { pluginId }));
};
exports.getPlugin = getPlugin;
