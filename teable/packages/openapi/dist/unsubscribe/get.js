"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnSubscribe = exports.getUnSubscribeRoute = exports.unsubscribeVoSchema = exports.unsubscribeAutomationSendEmailActionSchema = exports.unsubscribeBaseSchema = exports.GET_UNSUBSCRIBE = void 0;
const axios_1 = require("../axios");
const types_1 = require("../mail/types");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_UNSUBSCRIBE = '/unsubscribe/{token}';
exports.unsubscribeBaseSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(types_1.MailType),
    baseId: zod_1.z.string(),
    email: zod_1.z.string(),
    subscriptionStatus: zod_1.z.boolean().optional(),
});
exports.unsubscribeAutomationSendEmailActionSchema = exports.unsubscribeBaseSchema.extend({
    type: zod_1.z.literal(types_1.MailType.AutomationSendEmailAction),
    actionId: zod_1.z.string(),
});
exports.unsubscribeVoSchema = exports.unsubscribeBaseSchema.extend({});
exports.getUnSubscribeRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_UNSUBSCRIBE,
    description: 'Get unsubscribe information',
    request: {
        params: zod_1.z.object({
            token: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: exports.unsubscribeVoSchema,
                },
            },
        },
    },
    tags: ['unsubscribe'],
});
const getUnSubscribe = async (token) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_UNSUBSCRIBE, { token }));
};
exports.getUnSubscribe = getUnSubscribe;
