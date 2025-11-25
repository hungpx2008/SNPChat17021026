"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.CreateCommentRoute = exports.CREATE_COMMENT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.CREATE_COMMENT = '/comment/{tableId}/{recordId}/create';
exports.CreateCommentRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_COMMENT,
    description: 'create record comment',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: types_1.createCommentRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully create comment.',
        },
    },
    tags: ['comment'],
});
const createComment = async (tableId, recordId, createCommentRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_COMMENT, { tableId, recordId }), createCommentRo);
};
exports.createComment = createComment;
