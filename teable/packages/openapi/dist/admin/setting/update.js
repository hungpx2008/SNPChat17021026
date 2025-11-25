"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSetting = exports.UpdateSettingRoute = exports.UPDATE_SETTING = exports.updateSettingRoSchema = exports.webSearchConfigSchema = exports.appConfigSchema = exports.aiConfigVoSchema = exports.aiConfigSchema = exports.chatModelSchema = exports.chatModelAbilityType = exports.chatModelAbilitySchema = exports.llmProviderSchema = exports.LLMProviderType = void 0;
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
var LLMProviderType;
(function (LLMProviderType) {
    LLMProviderType["OPENAI"] = "openai";
    LLMProviderType["ANTHROPIC"] = "anthropic";
    LLMProviderType["GOOGLE"] = "google";
    LLMProviderType["AZURE"] = "azure";
    LLMProviderType["COHERE"] = "cohere";
    LLMProviderType["MISTRAL"] = "mistral";
    LLMProviderType["DEEPSEEK"] = "deepseek";
    LLMProviderType["QWEN"] = "qwen";
    LLMProviderType["ZHIPU"] = "zhipu";
    LLMProviderType["LINGYIWANWU"] = "lingyiwanwu";
    LLMProviderType["XAI"] = "xai";
    LLMProviderType["TOGETHERAI"] = "togetherai";
    LLMProviderType["OLLAMA"] = "ollama";
    LLMProviderType["AMAZONBEDROCK"] = "amazonBedrock";
    LLMProviderType["OPENROUTER"] = "openRouter";
})(LLMProviderType || (exports.LLMProviderType = LLMProviderType = {}));
exports.llmProviderSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(LLMProviderType),
    name: zod_1.z.string(),
    apiKey: zod_1.z.string().optional(),
    baseUrl: zod_1.z.string().url().optional(),
    models: zod_1.z.string().default(''),
    isInstance: zod_1.z.boolean().optional(),
});
exports.chatModelAbilitySchema = zod_1.z.object({
    image: zod_1.z.boolean().optional(),
    pdf: zod_1.z.boolean().optional(),
    webSearch: zod_1.z.boolean().optional(),
});
exports.chatModelAbilityType = exports.chatModelAbilitySchema.keyof();
exports.chatModelSchema = zod_1.z.object({
    lg: zod_1.z.string().optional(),
    md: zod_1.z.string().optional(),
    sm: zod_1.z.string().optional(),
    ability: exports.chatModelAbilitySchema.optional(),
});
exports.aiConfigSchema = zod_1.z.object({
    llmProviders: zod_1.z.array(exports.llmProviderSchema).default([]),
    embeddingModel: zod_1.z.string().optional(),
    translationModel: zod_1.z.string().optional(),
    chatModel: exports.chatModelSchema.optional(),
    capabilities: zod_1.z
        .object({
        disableActions: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .optional(),
});
exports.aiConfigVoSchema = exports.aiConfigSchema.merge(zod_1.z.object({
    enable: zod_1.z.boolean().optional(),
}));
exports.appConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string().optional(),
    creditCount: zod_1.z.number().min(0).optional(),
});
exports.webSearchConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string().optional(),
});
exports.updateSettingRoSchema = zod_1.z.object({
    disallowSignUp: zod_1.z.boolean().optional(),
    disallowSpaceCreation: zod_1.z.boolean().optional(),
    disallowSpaceInvitation: zod_1.z.boolean().optional(),
    enableEmailVerification: zod_1.z.boolean().optional(),
    aiConfig: exports.aiConfigVoSchema.optional(),
    enableWaitlist: zod_1.z.boolean().optional(),
    appConfig: exports.appConfigSchema.optional(),
    webSearchConfig: exports.webSearchConfigSchema.optional(),
    brandName: zod_1.z.string().optional(),
});
exports.UPDATE_SETTING = '/admin/setting';
exports.UpdateSettingRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_SETTING,
    description: 'Get the instance settings',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.updateSettingRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Update settings successfully.',
        },
    },
    tags: ['admin'],
});
const updateSetting = async (updateSettingRo) => {
    return axios_1.axios.patch(exports.UPDATE_SETTING, updateSettingRo);
};
exports.updateSetting = updateSetting;
