"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = exports.updateSubscriptionRoute = exports.updateSubscriptionRoSchema = exports.UPDATE_UNSUBSCRIBE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_UNSUBSCRIBE = '/unsubscribe/{token}';
exports.updateSubscriptionRoSchema = zod_1.z.object({
    subscriptionStatus: zod_1.z.boolean(),
});
exports.updateSubscriptionRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.UPDATE_UNSUBSCRIBE,
    description: 'Update subscription status',
    request: {
        params: zod_1.z.object({
            token: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateSubscriptionRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: zod_1.z.boolean(),
                },
            },
        },
    },
    tags: ['unsubscribe'],
});
const updateSubscription = async (token, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.UPDATE_UNSUBSCRIBE, { token }), ro);
};
exports.updateSubscription = updateSubscription;
