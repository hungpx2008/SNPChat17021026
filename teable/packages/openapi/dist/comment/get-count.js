"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordCommentCount = exports.GetRecordCommentCountRoute = exports.recordCommentCountVoSchema = exports.GET_RECORD_COMMENT_COUNT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_RECORD_COMMENT_COUNT = '/comment/{tableId}/{recordId}/count';
exports.recordCommentCountVoSchema = zod_1.z.object({
    count: zod_1.z.number(),
});
exports.GetRecordCommentCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORD_COMMENT_COUNT,
    description: 'Get record comment count',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the comment count by query',
            content: {
                'application/json': {
                    schema: exports.recordCommentCountVoSchema,
                },
            },
        },
    },
    tags: ['comment'],
});
const getRecordCommentCount = async (tableId, recordId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORD_COMMENT_COUNT, { tableId, recordId }));
};
exports.getRecordCommentCount = getRecordCommentCount;
