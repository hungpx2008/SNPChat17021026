"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPatchDataSchema = exports.updateCommentRoSchema = exports.createCommentRoSchema = exports.commentContentSchema = exports.paragraphCommentContentSchema = exports.imageCommentContentSchema = exports.linkCommentContentSchema = exports.mentionCommentContentSchema = exports.textCommentContentSchema = exports.baseCommentContentSchema = exports.CommentPatchType = exports.CommentNodeType = void 0;
const zod_1 = require("../zod");
var CommentNodeType;
(function (CommentNodeType) {
    // inline
    CommentNodeType["Text"] = "span";
    CommentNodeType["Link"] = "a";
    // block
    CommentNodeType["Paragraph"] = "p";
    CommentNodeType["Img"] = "img";
    // custom
    CommentNodeType["Mention"] = "mention";
})(CommentNodeType || (exports.CommentNodeType = CommentNodeType = {}));
var CommentPatchType;
(function (CommentPatchType) {
    CommentPatchType["CreateComment"] = "create_comment";
    CommentPatchType["UpdateComment"] = "update_comment";
    CommentPatchType["DeleteComment"] = "delete_comment";
    CommentPatchType["CreateReaction"] = "create_reaction";
    CommentPatchType["DeleteReaction"] = "delete_reaction";
})(CommentPatchType || (exports.CommentPatchType = CommentPatchType = {}));
exports.baseCommentContentSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(CommentNodeType),
    value: zod_1.z.unknown().optional(),
});
exports.textCommentContentSchema = exports.baseCommentContentSchema.extend({
    type: zod_1.z.literal(CommentNodeType.Text),
    value: zod_1.z.string(),
});
exports.mentionCommentContentSchema = exports.baseCommentContentSchema.extend({
    type: zod_1.z.literal(CommentNodeType.Mention),
    value: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
exports.linkCommentContentSchema = exports.baseCommentContentSchema.extend({
    type: zod_1.z.literal(CommentNodeType.Link),
    url: zod_1.z.string(),
    title: zod_1.z.string(),
});
exports.imageCommentContentSchema = exports.baseCommentContentSchema.extend({
    type: zod_1.z.literal(CommentNodeType.Img),
    path: zod_1.z.string(),
    width: zod_1.z.number().optional(),
    url: zod_1.z.string().optional(),
});
exports.paragraphCommentContentSchema = exports.baseCommentContentSchema.extend({
    type: zod_1.z.literal(CommentNodeType.Paragraph),
    children: zod_1.z.array(zod_1.z.union([exports.textCommentContentSchema, exports.mentionCommentContentSchema, exports.linkCommentContentSchema])),
});
exports.commentContentSchema = zod_1.z
    .union([exports.paragraphCommentContentSchema, exports.imageCommentContentSchema])
    .array();
exports.createCommentRoSchema = zod_1.z.object({
    quoteId: zod_1.z.string().optional().nullable(),
    content: exports.commentContentSchema,
});
exports.updateCommentRoSchema = exports.createCommentRoSchema.pick({
    content: true,
});
exports.commentPatchDataSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(CommentPatchType),
    data: zod_1.z.record(zod_1.z.unknown()),
});
