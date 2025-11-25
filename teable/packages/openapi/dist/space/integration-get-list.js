"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegrationList = exports.GetIntegrationListRoute = exports.aiIntegrationSettingSchema = exports.integrationItemVoSchema = exports.integrationConfigSchema = exports.aiIntegrationConfigSchema = exports.GET_INTEGRATION_LIST = exports.IntegrationType = void 0;
const admin_1 = require("../admin");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["AI"] = "AI";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
exports.GET_INTEGRATION_LIST = '/space/{spaceId}/integration';
exports.aiIntegrationConfigSchema = admin_1.aiConfigSchema.extend({
    appConfig: admin_1.appConfigSchema.optional(),
    webSearchConfig: admin_1.webSearchConfigSchema.optional(),
});
exports.integrationConfigSchema = exports.aiIntegrationConfigSchema;
exports.integrationItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    spaceId: zod_1.z.string(),
    type: zod_1.z.nativeEnum(IntegrationType),
    enable: zod_1.z.boolean().optional(),
    config: exports.integrationConfigSchema,
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string().optional(),
});
exports.aiIntegrationSettingSchema = admin_1.aiConfigSchema
    .pick({
    chatModel: true,
})
    .extend({
    enable: zod_1.z.boolean().optional(),
    llmProviders: zod_1.z.array(admin_1.simpleLLMProviderSchema.omit({
        isInstance: true,
    })),
});
exports.GetIntegrationListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_INTEGRATION_LIST,
    description: 'Get integration list by query',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the list of integration.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.integrationItemVoSchema),
                },
            },
        },
    },
    tags: ['space', 'integration'],
});
const getIntegrationList = async (spaceId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_INTEGRATION_LIST, { spaceId }));
};
exports.getIntegrationList = getIntegrationList;
