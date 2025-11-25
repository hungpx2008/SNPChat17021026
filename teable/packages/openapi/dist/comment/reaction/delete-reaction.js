"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentReaction = exports.DeleteCommentReactionRoute = exports.DELETE_COMMENT_REACTION = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const create_reaction_1 = require("./create-reaction");
exports.DELETE_COMMENT_REACTION = '/comment/{tableId}/{recordId}/{commentId}/reaction';
exports.DeleteCommentReactionRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_COMMENT_REACTION,
    description: 'delete record comment reaction',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            commentId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: create_reaction_1.updateCommentReactionRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully delete comment reaction.',
        },
    },
    tags: ['comment'],
});
const deleteCommentReaction = async (tableId, recordId, commentId, deleteCommentReactionRo) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_COMMENT_REACTION, { tableId, recordId, commentId }), {
        data: deleteCommentReactionRo,
    });
};
exports.deleteCommentReaction = deleteCommentReaction;
