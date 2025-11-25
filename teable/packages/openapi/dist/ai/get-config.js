"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIConfig = exports.GetAIConfigRoute = exports.getAIConfigSchema = exports.modelDefinationMapSchema = exports.modelDefinationSchema = exports.imageModelDefinationSchema = exports.textModelDefinationSchema = exports.ModelOutputType = exports.GET_AI_CONFIG = void 0;
const zod_1 = require("zod");
const admin_1 = require("../admin");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.GET_AI_CONFIG = '/{baseId}/ai/config';
var ModelOutputType;
(function (ModelOutputType) {
    ModelOutputType["Image"] = "image";
    ModelOutputType["Audio"] = "audio";
    ModelOutputType["Video"] = "video";
})(ModelOutputType || (exports.ModelOutputType = ModelOutputType = {}));
exports.textModelDefinationSchema = zod_1.z.object({
    inputRate: zod_1.z.number().openapi({
        example: 0.001,
        description: 'The number of credits spent using a prompt token',
    }),
    outputRate: zod_1.z.number().openapi({
        example: 0.0025,
        description: 'The number of credits spent using a completion token',
    }),
    visionEnable: zod_1.z.boolean().optional().openapi({ description: 'Whether to enable vision' }),
    audioEnable: zod_1.z.boolean().optional().openapi({ description: 'Whether to enable audio' }),
    videoEnable: zod_1.z.boolean().optional().openapi({ description: 'Whether to enable video' }),
    deepThinkEnable: zod_1.z.boolean().optional().openapi({ description: 'Whether to enable deep think' }),
});
exports.imageModelDefinationSchema = zod_1.z.object({
    usagePerUnit: zod_1.z.number().openapi({
        example: 100,
        description: 'The number of credits spent for generating one image',
    }),
    outputType: zod_1.z.nativeEnum(ModelOutputType),
});
exports.modelDefinationSchema = zod_1.z.union([
    exports.textModelDefinationSchema,
    exports.imageModelDefinationSchema,
]);
exports.modelDefinationMapSchema = zod_1.z.record(zod_1.z.string(), exports.modelDefinationSchema);
exports.getAIConfigSchema = admin_1.aiConfigSchema.merge(zod_1.z.object({
    modelDefinationMap: exports.modelDefinationMapSchema.optional(),
}));
exports.GetAIConfigRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_AI_CONFIG,
    description: 'Get the configuration of ai, including instance and space configuration',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the configuration of ai.',
            content: {
                'application/json': {
                    schema: exports.getAIConfigSchema,
                },
            },
        },
    },
    tags: ['ai'],
});
const getAIConfig = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_AI_CONFIG, { baseId }));
};
exports.getAIConfig = getAIConfig;
