"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginCenterList = exports.GetPluginCenterListRoute = exports.getPluginCenterListVoSchema = exports.getPluginCenterListRoSchema = exports.PLUGIN_CENTER_GET_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.PLUGIN_CENTER_GET_LIST = '/plugin/center/list';
exports.getPluginCenterListRoSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()).optional(),
    positions: zod_1.z
        .string()
        .optional()
        .transform((value, ctx) => {
        if (value == null) {
            return value;
        }
        const parsingResult = zod_1.z
            .array(zod_1.z.nativeEnum(types_1.PluginPosition))
            .min(1)
            .safeParse(JSON.parse(value));
        if (!parsingResult.success) {
            parsingResult.error.issues.forEach((issue) => {
                ctx.addIssue(issue);
            });
            return zod_1.z.NEVER;
        }
        return Array.from(new Set(parsingResult.data));
    }),
});
exports.getPluginCenterListVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    detailDesc: zod_1.z.string().optional(),
    logo: zod_1.z.string(),
    helpUrl: zod_1.z.string().optional(),
    i18n: types_1.pluginI18nSchema.optional(),
    url: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(types_1.PluginStatus),
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string().optional(),
    createdBy: types_1.pluginCreatedBySchema,
}));
exports.GetPluginCenterListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLUGIN_CENTER_GET_LIST,
    description: 'Get a list of plugins center',
    request: {
        query: exports.getPluginCenterListRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about the plugin center list.',
            content: {
                'application/json': {
                    schema: exports.getPluginCenterListVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const getPluginCenterList = async (positions, ids) => {
    return axios_1.axios.get(exports.PLUGIN_CENTER_GET_LIST, {
        params: {
            positions: JSON.stringify(positions),
            ids,
        },
    });
};
exports.getPluginCenterList = getPluginCenterList;
