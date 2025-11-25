"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.UpdateCommentRoute = exports.UPDATE_COMMENT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.UPDATE_COMMENT = '/comment/{tableId}/{recordId}/{commentId}';
exports.UpdateCommentRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_COMMENT,
    description: 'update record comment',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            commentId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: types_1.updateCommentRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully update comment.',
        },
    },
    tags: ['comment'],
});
const updateComment = async (tableId, recordId, commentId, updateCommentRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_COMMENT, { tableId, recordId, commentId }), updateCommentRo);
};
exports.updateComment = updateComment;
