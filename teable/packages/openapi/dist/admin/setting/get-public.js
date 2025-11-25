"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSetting = exports.GetPublicSettingRoute = exports.GET_PUBLIC_SETTING = exports.publicSettingVoSchema = exports.simpleLLMProviderSchema = void 0;
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const get_1 = require("./get");
const update_1 = require("./update");
exports.simpleLLMProviderSchema = update_1.llmProviderSchema.pick({
    type: true,
    name: true,
    models: true,
    isInstance: true,
});
const publicAiConfigSchema = zod_1.z.object({
    enable: zod_1.z.boolean(),
    llmProviders: zod_1.z.array(exports.simpleLLMProviderSchema),
    chatModel: update_1.chatModelSchema.optional(),
    capabilities: zod_1.z
        .object({
        disableActions: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .optional(),
});
exports.publicSettingVoSchema = get_1.settingVoSchema
    .pick({
    instanceId: true,
    brandName: true,
    brandLogo: true,
    disallowSignUp: true,
    disallowSpaceCreation: true,
    disallowSpaceInvitation: true,
    enableEmailVerification: true,
    enableWaitlist: true,
    createdTime: true,
})
    .merge(zod_1.z.object({
    aiConfig: publicAiConfigSchema.nullable(),
    webSearchEnabled: zod_1.z.boolean().optional(),
    appGenerationEnabled: zod_1.z.boolean().optional(),
    turnstileSiteKey: zod_1.z.string().nullable().optional(),
    changeEmailSendCodeMailRate: zod_1.z.number().optional(),
    resetPasswordSendMailRate: zod_1.z.number().optional(),
    signupVerificationSendCodeMailRate: zod_1.z.number().optional(),
}));
exports.GET_PUBLIC_SETTING = '/admin/setting/public';
exports.GetPublicSettingRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PUBLIC_SETTING,
    description: 'Get the public instance settings',
    request: {},
    responses: {
        200: {
            description: 'Returns the public instance settings.',
            content: {
                'application/json': {
                    schema: exports.publicSettingVoSchema,
                },
            },
        },
    },
    tags: ['admin'],
});
const getPublicSetting = async () => {
    return axios_1.axios.get(exports.GET_PUBLIC_SETTING);
};
exports.getPublicSetting = getPublicSetting;
