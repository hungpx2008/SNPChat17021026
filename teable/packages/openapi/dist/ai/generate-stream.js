"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerateStream = exports.aiGenerateRoute = exports.aiGenerateVoSchema = exports.aiGenerateRoSchema = exports.AI_GENERATE_STREAM = exports.Task = void 0;
const utils_1 = require("../utils");
const zod_1 = require("../zod");
var Task;
(function (Task) {
    Task["Coding"] = "coding";
    Task["Embedding"] = "embedding";
    Task["Translation"] = "translation";
})(Task || (exports.Task = Task = {}));
exports.AI_GENERATE_STREAM = '/api/{baseId}/ai/generate-stream';
exports.aiGenerateRoSchema = zod_1.z.object({
    prompt: zod_1.z.string(),
    task: zod_1.z.nativeEnum(Task).optional().openapi({
        description: 'Quick model selection via predefined task type',
        example: Task.Coding,
    }),
    modelKey: zod_1.z.string().optional().openapi({
        description: 'Specify an exact model configuration to use',
        example: 'openai@gpt-4o@custom-name',
    }),
});
exports.aiGenerateVoSchema = zod_1.z.object({
    result: zod_1.z.string(),
});
exports.aiGenerateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.AI_GENERATE_STREAM,
    description: 'Generate ai stream',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.aiGenerateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns ai generate stream.',
            content: {
                'application/json': {
                    schema: exports.aiGenerateVoSchema,
                },
            },
        },
    },
    tags: ['ai'],
});
const aiGenerateStream = (baseId, aiGenerateRo, signal) => {
    return fetch((0, utils_1.urlBuilder)(exports.AI_GENERATE_STREAM, {
        baseId,
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiGenerateRo),
        signal,
    });
};
exports.aiGenerateStream = aiGenerateStream;
