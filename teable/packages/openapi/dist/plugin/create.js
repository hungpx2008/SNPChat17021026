"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = exports.createPluginRoute = exports.createPluginVoSchema = exports.createPluginRoSchema = exports.CREATE_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.CREATE_PLUGIN = '/plugin';
exports.createPluginRoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(20),
    description: zod_1.z.string().max(150).optional(),
    detailDesc: zod_1.z.string().max(3000).optional(),
    logo: zod_1.z.string(),
    url: zod_1.z.string().url().optional(),
    config: types_1.pluginConfigSchema.optional(),
    helpUrl: zod_1.z.string().url().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)).min(1),
    i18n: types_1.pluginI18nSchema.optional(),
    autoCreateMember: zod_1.z.boolean().optional(),
});
exports.createPluginVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    detailDesc: zod_1.z.string().optional(),
    logo: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    config: types_1.pluginConfigSchema.optional(),
    helpUrl: zod_1.z.string().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)),
    i18n: types_1.pluginI18nSchema.optional(),
    secret: zod_1.z.string(),
    status: zod_1.z.nativeEnum(types_1.PluginStatus),
    pluginUser: types_1.pluginUserSchema,
    createdTime: zod_1.z.string(),
});
exports.createPluginRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_PLUGIN,
    description: 'Create a plugin',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createPluginRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about the plugin.',
            content: {
                'application/json': {
                    schema: exports.createPluginVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const createPlugin = (data) => {
    return axios_1.axios.post(exports.CREATE_PLUGIN, data);
};
exports.createPlugin = createPlugin;
