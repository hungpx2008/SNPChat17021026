"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugins = exports.GetPluginsRoute = exports.getPluginsVoSchema = exports.GET_PLUGINS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_PLUGINS = '/plugin';
exports.getPluginsVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    detailDesc: zod_1.z.string().optional(),
    logo: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    helpUrl: zod_1.z.string().optional(),
    positions: zod_1.z.array(zod_1.z.nativeEnum(types_1.PluginPosition)),
    i18n: types_1.pluginI18nSchema,
    status: zod_1.z.nativeEnum(types_1.PluginStatus),
    pluginUser: types_1.pluginUserSchema,
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string(),
}));
exports.GetPluginsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PLUGINS,
    description: 'Get plugins',
    responses: {
        200: {
            description: 'Returns data about the plugins.',
            content: {
                'application/json': {
                    schema: exports.getPluginsVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const getPlugins = async () => {
    return axios_1.axios.get(exports.GET_PLUGINS);
};
exports.getPlugins = getPlugins;
