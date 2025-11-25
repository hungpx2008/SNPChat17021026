"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewAggregations = exports.ShareViewAggregationsRoute = exports.shareViewAggregationsRoSchema = exports.SHARE_VIEW_AGGREGATIONS_LIST = void 0;
const core_1 = require("@teable/core");
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_AGGREGATIONS_LIST = '/share/{shareId}/view/aggregations';
exports.shareViewAggregationsRoSchema = aggregation_1.aggregationRoSchema.omit({
    viewId: true,
});
exports.ShareViewAggregationsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_AGGREGATIONS_LIST,
    description: 'Get share view aggregations',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewAggregationsRoSchema,
    },
    responses: {
        200: {
            description: 'Returns aggregations list of share view.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(core_1.viewVoSchema),
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewAggregations = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_AGGREGATIONS_LIST, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            groupBy: JSON.stringify(query?.groupBy),
        },
    });
};
exports.getShareViewAggregations = getShareViewAggregations;
