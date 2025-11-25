"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionSummaryList = exports.GetSubscriptionSummaryListRoute = exports.GET_SUBSCRIPTION_SUMMARY_LIST = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const get_subscription_summary_1 = require("./get-subscription-summary");
exports.GET_SUBSCRIPTION_SUMMARY_LIST = '/billing/subscription/summary';
exports.GetSubscriptionSummaryListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SUBSCRIPTION_SUMMARY_LIST,
    description: 'Retrieves a summary of subscription information across all spaces',
    request: {},
    responses: {
        200: {
            description: 'Returns a summary of subscription information for each space.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(get_subscription_summary_1.subscriptionSummaryVoSchema),
                },
            },
        },
    },
    tags: ['billing'],
});
const getSubscriptionSummaryList = async (axios) => {
    const theAxios = axios || axios_1.axios;
    return theAxios.get(exports.GET_SUBSCRIPTION_SUMMARY_LIST);
};
exports.getSubscriptionSummaryList = getSubscriptionSummaryList;
