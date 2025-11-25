"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionSummary = exports.GetSubscriptionSummaryRoute = exports.GET_SUBSCRIPTION_SUMMARY = exports.subscriptionSummaryVoSchema = exports.SubscriptionStatus = exports.BillingProductLevel = exports.RecurringIntervalType = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
var RecurringIntervalType;
(function (RecurringIntervalType) {
    RecurringIntervalType["Month"] = "month";
    RecurringIntervalType["Year"] = "year";
})(RecurringIntervalType || (exports.RecurringIntervalType = RecurringIntervalType = {}));
var BillingProductLevel;
(function (BillingProductLevel) {
    BillingProductLevel["Free"] = "free";
    BillingProductLevel["Plus"] = "plus";
    BillingProductLevel["Pro"] = "pro";
    BillingProductLevel["Enterprise"] = "enterprise";
})(BillingProductLevel || (exports.BillingProductLevel = BillingProductLevel = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["Active"] = "active";
    SubscriptionStatus["Canceled"] = "canceled";
    SubscriptionStatus["Incomplete"] = "incomplete";
    SubscriptionStatus["IncompleteExpired"] = "incomplete_expired";
    SubscriptionStatus["Trialing"] = "trialing";
    SubscriptionStatus["PastDue"] = "past_due";
    SubscriptionStatus["Unpaid"] = "unpaid";
    SubscriptionStatus["Paused"] = "paused";
    SubscriptionStatus["SeatLimitExceeded"] = "seat_limit_exceeded";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
exports.subscriptionSummaryVoSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
    status: zod_1.z.nativeEnum(SubscriptionStatus),
    level: zod_1.z.nativeEnum(BillingProductLevel),
});
exports.GET_SUBSCRIPTION_SUMMARY = '/space/{spaceId}/billing/subscription/summary';
exports.GetSubscriptionSummaryRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SUBSCRIPTION_SUMMARY,
    description: 'Retrieves a summary of subscription information for a space',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns a summary of subscription information about a space.',
            content: {
                'application/json': {
                    schema: exports.subscriptionSummaryVoSchema,
                },
            },
        },
    },
    tags: ['billing'],
});
async function getSubscriptionSummary(spaceId) {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_SUBSCRIPTION_SUMMARY, {
        spaceId: spaceId,
    }));
}
exports.getSubscriptionSummary = getSubscriptionSummary;
