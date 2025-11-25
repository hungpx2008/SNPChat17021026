"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarDailyCollection = exports.GetCalendarDailyCollectionRoute = exports.GET_CALENDAR_DAILY_COLLECTION = exports.calendarDailyCollectionVoSchema = exports.calendarDailyCollectionRoSchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.calendarDailyCollectionRoSchema = record_1.contentQueryBaseSchema
    .pick({
    viewId: true,
    filter: true,
    search: true,
    ignoreViewQuery: true,
})
    .merge(zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    startDateFieldId: zod_1.z.string(),
    endDateFieldId: zod_1.z.string(),
}));
exports.calendarDailyCollectionVoSchema = zod_1.z.object({
    countMap: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    records: zod_1.z.array(core_1.recordSchema),
});
exports.GET_CALENDAR_DAILY_COLLECTION = '/table/{tableId}/aggregation/calendar-daily-collection';
exports.GetCalendarDailyCollectionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_CALENDAR_DAILY_COLLECTION,
    summary: 'Get daily calendar data',
    description: 'Returns records and count distribution across dates based on specified date range and fields',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.calendarDailyCollectionRoSchema,
    },
    responses: {
        200: {
            description: 'Calendar daily collection for the view',
            content: {
                'application/json': {
                    schema: exports.calendarDailyCollectionVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getCalendarDailyCollection = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_CALENDAR_DAILY_COLLECTION, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
        },
    });
};
exports.getCalendarDailyCollection = getCalendarDailyCollection;
