"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentDetail = exports.GetCommentDetailRoute = exports.commentSchema = exports.GET_COMMENT_DETAIL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const reaction_1 = require("./reaction");
const types_1 = require("./types");
exports.GET_COMMENT_DETAIL = '/comment/{tableId}/{recordId}/{commentId}';
exports.commentSchema = zod_1.z.object({
    id: zod_1.z.string(),
    content: types_1.commentContentSchema,
    createdBy: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string().optional(),
    }),
    reaction: reaction_1.commentReactionDetailSchema.optional().nullable(),
    createdTime: zod_1.z.string(),
    lastModifiedTime: zod_1.z.string().optional(),
    quoteId: zod_1.z.string().optional(),
    deletedTime: zod_1.z.string().optional(),
});
exports.GetCommentDetailRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_COMMENT_DETAIL,
    description: 'Get record comment detail',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: "Returns the record's comment detail",
            content: {
                'application/json': {
                    schema: exports.commentSchema.array(),
                },
            },
        },
    },
    tags: ['comment'],
});
const getCommentDetail = async (tableId, recordId, commentId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_COMMENT_DETAIL, { tableId, recordId, commentId }));
};
exports.getCommentDetail = getCommentDetail;
