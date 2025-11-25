"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentCount = exports.GetCommentCountRoute = exports.commentCountVoSchema = exports.GET_COMMENT_COUNT = void 0;
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_COMMENT_COUNT = '/comment/{tableId}/count';
exports.commentCountVoSchema = zod_1.z
    .object({
    recordId: zod_1.z.string(),
    count: zod_1.z.number(),
})
    .array();
exports.GetCommentCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_COMMENT_COUNT,
    description: 'Get record comment counts by query',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: record_1.getRecordsRoSchema,
    },
    responses: {
        200: {
            description: 'Returns the comment counts by query',
            content: {
                'application/json': {
                    schema: exports.commentCountVoSchema,
                },
            },
        },
    },
    tags: ['comment'],
});
const getCommentCount = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_COMMENT_COUNT, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query.filter),
            orderBy: JSON.stringify(query.orderBy),
            groupBy: JSON.stringify(query.groupBy),
            collapsedGroupIds: JSON.stringify(query.collapsedGroupIds),
        },
    });
};
exports.getCommentCount = getCommentCount;
