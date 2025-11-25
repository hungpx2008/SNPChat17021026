"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewSearchCount = exports.GetShareViewSearchCountRoute = exports.GET_SHARE_VIEW_SEARCH_COUNT = void 0;
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_SHARE_VIEW_SEARCH_COUNT = '/share/{shareId}/view/search-count';
exports.GetShareViewSearchCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SHARE_VIEW_SEARCH_COUNT,
    description: 'Get share view search result count with query',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: aggregation_1.searchCountRoSchema,
    },
    responses: {
        200: {
            description: 'Share view Search count with query',
            content: {
                'application/json': {
                    schema: aggregation_1.searchCountVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewSearchCount = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_SHARE_VIEW_SEARCH_COUNT, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
        },
    });
};
exports.getShareViewSearchCount = getShareViewSearchCount;
