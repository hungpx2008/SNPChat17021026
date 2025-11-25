"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlugin = exports.updatePluginRoute = exports.updatePluginVoSchema = exports.updatePluginRoSchema = exports.UPDATE_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.UPDATE_PLUGIN = '/plugin/{id}';
exports.updatePluginRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().max(150).optional(),
    detailDesc: zod_1.z.string().max(3000).optional(),
    url: zod_1.z.string().url().optional(),
    config: types_1.pluginConfigSchema.optional(),
    logo: zod_1.z.string().optional(),
    helpUrl: zod_1.z.string().url().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)).min(1),
    i18n: types_1.pluginI18nSchema.optional(),
});
exports.updatePluginVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    detailDesc: zod_1.z.string().optional(),
    logo: zod_1.z.string(),
    config: types_1.pluginConfigSchema.optional(),
    url: zod_1.z.string().optional(),
    helpUrl: zod_1.z.string().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)),
    i18n: types_1.pluginI18nSchema.optional(),
    secret: zod_1.z.string(),
    status: zod_1.z.nativeEnum(types_1.PluginStatus),
    pluginUser: types_1.pluginUserSchema,
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string(),
});
exports.updatePluginRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.UPDATE_PLUGIN,
    description: 'Update a plugin',
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updatePluginRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns data about the plugin.',
            content: {
                'application/json': {
                    schema: exports.updatePluginVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const updatePlugin = async (id, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.UPDATE_PLUGIN, { id }), data);
};
exports.updatePlugin = updatePlugin;
