"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLLM = exports.TestLLMRoute = exports.TEST_LLM = exports.testLLMVoSchema = exports.testLLMRoSchema = void 0;
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const update_1 = require("./update");
exports.testLLMRoSchema = update_1.llmProviderSchema
    .omit({
    isInstance: true,
})
    .required()
    .extend({
    modelKey: zod_1.z.string().optional(),
    ability: zod_1.z.array(update_1.chatModelAbilityType).optional(),
});
exports.testLLMVoSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    response: zod_1.z.string().optional(),
    ability: update_1.chatModelAbilitySchema.optional(),
});
exports.TEST_LLM = '/admin/setting/test-llm';
exports.TestLLMRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.TEST_LLM,
    description: 'Test LLM provider configuration',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.testLLMRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Test result',
            content: {
                'application/json': {
                    schema: exports.testLLMVoSchema,
                },
            },
        },
    },
    tags: ['admin', 'setting'],
});
const testLLM = async (data) => {
    const response = await axios_1.axios.post(exports.TEST_LLM, data);
    return response.data;
};
exports.testLLM = testLLM;
