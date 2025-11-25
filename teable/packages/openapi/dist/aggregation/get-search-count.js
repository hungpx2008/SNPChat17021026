"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchCount = exports.GetSearchCountRoute = exports.searchCountRoSchema = exports.GET_Search_COUNT = exports.searchCountVoSchema = void 0;
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.searchCountVoSchema = zod_1.z.object({
    count: zod_1.z.number(),
});
exports.GET_Search_COUNT = '/table/{tableId}/aggregation/search-count';
exports.searchCountRoSchema = record_1.queryBaseSchema.pick({
    filter: true,
    viewId: true,
    search: true,
    ignoreViewQuery: true,
});
exports.GetSearchCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_Search_COUNT,
    summary: 'Get total count of search',
    description: 'Returns the total count of records matching the specified search criteria and filters',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.searchCountRoSchema,
    },
    responses: {
        200: {
            description: 'Search count with query',
            content: {
                'application/json': {
                    schema: exports.searchCountVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getSearchCount = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_Search_COUNT, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
        },
    });
};
exports.getSearchCount = getSearchCount;
