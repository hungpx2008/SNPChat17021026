"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentList = exports.GetCommentListRoute = exports.getCommentListQueryRoSchema = exports.getCommentListVoSchema = exports.GET_COMMENT_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.GET_COMMENT_LIST = '/comment/{tableId}/{recordId}/list';
exports.getCommentListVoSchema = zod_1.z.object({
    comments: get_1.commentSchema.array(),
    nextCursor: zod_1.z.string().optional().nullable(),
});
exports.getCommentListQueryRoSchema = zod_1.z.object({
    take: zod_1.z
        .string()
        .or(zod_1.z.number())
        .transform(Number)
        .pipe(zod_1.z
        .number()
        .min(1, 'You should at least take 1 record')
        .max(1000, `Can't take more than ${1000} records, please reduce take count`))
        .default(20)
        .optional()
        .openapi({
        example: 20,
        description: `The record count you want to take, maximum is ${1000}`,
    }),
    cursor: zod_1.z.string().optional().nullable(),
    includeCursor: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false']).transform((value) => value === 'true')])
        .optional(),
    direction: zod_1.z.union([zod_1.z.literal('forward'), zod_1.z.literal('backward')]).optional(),
});
exports.GetCommentListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_COMMENT_LIST,
    description: 'Get record comment list',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        query: exports.getCommentListQueryRoSchema,
    },
    responses: {
        200: {
            description: "Returns the list of record's comment",
            content: {
                'application/json': {
                    schema: exports.getCommentListVoSchema,
                },
            },
        },
    },
    tags: ['comment'],
});
const getCommentList = async (tableId, recordId, getCommentListQueryRo) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_COMMENT_LIST, { tableId, recordId }), {
        params: getCommentListQueryRo,
    });
};
exports.getCommentList = getCommentList;
