"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchIndex = exports.GetSearchIndexRoute = exports.GET_Search_INDEX = exports.searchIndexByQueryRoSchema = exports.searchIndexVoSchema = exports.DEFAULT_MAX_SEARCH_FIELD_COUNT = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DEFAULT_MAX_SEARCH_FIELD_COUNT = Infinity;
exports.searchIndexVoSchema = zod_1.z
    .object({
    index: zod_1.z.number(),
    fieldId: zod_1.z.string(),
    recordId: zod_1.z.string(),
})
    .array()
    .nullable();
exports.searchIndexByQueryRoSchema = record_1.contentQueryBaseSchema
    .omit({
    collapsedGroupIds: true,
})
    .extend({
    skip: zod_1.z.coerce.number().optional(),
    take: zod_1.z.coerce.number(),
    projection: zod_1.z.array(zod_1.z.string().startsWith(core_1.IdPrefix.Field)).optional().openapi({
        description: 'If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained',
    }),
});
exports.GET_Search_INDEX = '/table/{tableId}/aggregation/search-index';
exports.GetSearchIndexRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_Search_INDEX,
    summary: 'Get record indices for search',
    description: 'Returns the indices and record IDs of records matching the search criteria',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: record_1.queryBaseSchema,
    },
    responses: {
        200: {
            description: 'record index with search query',
            content: {
                'application/json': {
                    schema: exports.searchIndexVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getSearchIndex = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_Search_INDEX, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            orderBy: JSON.stringify(query?.orderBy),
            groupBy: JSON.stringify(query?.groupBy),
        },
    });
};
exports.getSearchIndex = getSearchIndex;
