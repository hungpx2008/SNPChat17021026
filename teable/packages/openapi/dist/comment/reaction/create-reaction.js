"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentReaction = exports.CreateCommentReactionRoute = exports.updateCommentReactionRoSchema = exports.commentReactionDetailSchema = exports.commentReactionSchema = exports.commentReactionSymbolSchema = exports.CREATE_COMMENT_REACTION = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const constant_1 = require("./constant");
exports.CREATE_COMMENT_REACTION = '/comment/{tableId}/{recordId}/{commentId}/reaction';
exports.commentReactionSymbolSchema = zod_1.z
    .string()
    .emoji()
    .refine((value) => {
    return constant_1.SUPPORT_EMOJIS.includes(value);
});
exports.commentReactionSchema = zod_1.z
    .object({
    reaction: exports.commentReactionSymbolSchema,
    user: zod_1.z.array(zod_1.z.string()),
})
    .array();
exports.commentReactionDetailSchema = zod_1.z
    .object({
    reaction: exports.commentReactionSymbolSchema,
    user: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string().optional(),
    })),
})
    .array();
exports.updateCommentReactionRoSchema = zod_1.z.object({
    reaction: exports.commentReactionSymbolSchema,
});
exports.CreateCommentReactionRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_COMMENT_REACTION,
    description: 'create record comment reaction',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            commentId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateCommentReactionRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully create comment reaction.',
        },
    },
    tags: ['comment'],
});
const createCommentReaction = async (tableId, recordId, commentId, createCommentReactionRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.CREATE_COMMENT_REACTION, { tableId, recordId, commentId }), createCommentReactionRo);
};
exports.createCommentReaction = createCommentReaction;
