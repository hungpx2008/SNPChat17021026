"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIDisableActions = exports.GetAIDisableActionsRoute = exports.getAIDisableActionsVoSchema = exports.GET_AI_DISABLE_ACTIONS = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.GET_AI_DISABLE_ACTIONS = '/{baseId}/ai/disable-ai-actions';
exports.getAIDisableActionsVoSchema = zod_1.z.object({
    disableActions: zod_1.z.array(zod_1.z.string()),
});
exports.GetAIDisableActionsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_AI_DISABLE_ACTIONS,
    description: 'Get the disable ai actions',
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
                    schema: exports.getAIDisableActionsVoSchema,
                },
            },
        },
    },
    tags: ['ai'],
});
const getAIDisableActions = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_AI_DISABLE_ACTIONS, { baseId }));
};
exports.getAIDisableActions = getAIDisableActions;
