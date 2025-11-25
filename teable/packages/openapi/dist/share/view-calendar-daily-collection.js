"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewCalendarDailyCollection = exports.ShareViewCalendarDailyCollectionRoute = exports.shareViewCalendarDailyCollectionRoSchema = exports.SHARE_VIEW_CALENDAR_DAILY_COLLECTION = void 0;
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_CALENDAR_DAILY_COLLECTION = '/share/{shareId}/view/calendar-daily-collection';
exports.shareViewCalendarDailyCollectionRoSchema = aggregation_1.calendarDailyCollectionRoSchema.omit({
    viewId: true,
});
exports.ShareViewCalendarDailyCollectionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_CALENDAR_DAILY_COLLECTION,
    description: 'Get calendar daily collection for the share view',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewCalendarDailyCollectionRoSchema,
    },
    responses: {
        200: {
            description: 'Calendar daily collection for the share view',
            content: {
                'application/json': {
                    schema: aggregation_1.calendarDailyCollectionVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewCalendarDailyCollection = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_CALENDAR_DAILY_COLLECTION, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query.filter),
        },
    });
};
exports.getShareViewCalendarDailyCollection = getShareViewCalendarDailyCollection;
