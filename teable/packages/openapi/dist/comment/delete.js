"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.DeleteCommentRoute = exports.DELETE_COMMENT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_COMMENT = '/comment/{tableId}/{recordId}/{commentId}';
exports.DeleteCommentRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_COMMENT,
    description: 'delete record comment',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            commentId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successfully delete comment.',
        },
    },
    tags: ['comment'],
});
const deleteComment = async (tableId, recordId, commentId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_COMMENT, { tableId, recordId, commentId }));
};
exports.deleteComment = deleteComment;
