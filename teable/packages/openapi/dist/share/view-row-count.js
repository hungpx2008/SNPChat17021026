"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewRowCount = exports.ShareViewRowCountRoute = exports.shareViewRowCountRoSchema = exports.SHARE_VIEW_ROW_COUNT = void 0;
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_ROW_COUNT = '/share/{shareId}/view/row-count';
exports.shareViewRowCountRoSchema = record_1.queryBaseSchema.omit({
    viewId: true,
});
exports.ShareViewRowCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_ROW_COUNT,
    description: 'Get row count for the share view',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewRowCountRoSchema,
    },
    responses: {
        200: {
            description: 'Row count for the share view',
            content: {
                'application/json': {
                    schema: aggregation_1.rowCountVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewRowCount = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_ROW_COUNT, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query.filter),
        },
    });
};
exports.getShareViewRowCount = getShareViewRowCount;
