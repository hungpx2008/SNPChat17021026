"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewSearchIndex = exports.GetShareViewSearchIndexRoute = exports.GET_SHARE_VIEW_SEARCH_INDEX = void 0;
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_SHARE_VIEW_SEARCH_INDEX = '/share/{shareId}/view/search-index';
exports.GetShareViewSearchIndexRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SHARE_VIEW_SEARCH_INDEX,
    description: 'Get share view record index with search query',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: record_1.queryBaseSchema,
    },
    responses: {
        200: {
            description: 'share view record index with search query',
            content: {
                'application/json': {
                    schema: aggregation_1.searchIndexVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewSearchIndex = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_SHARE_VIEW_SEARCH_INDEX, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            orderBy: JSON.stringify(query?.orderBy),
            groupBy: JSON.stringify(query?.groupBy),
        },
    });
};
exports.getShareViewSearchIndex = getShareViewSearchIndex;
