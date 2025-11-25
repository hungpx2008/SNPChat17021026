"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentSubscribe = exports.GetCommentSubscribeRoute = exports.commentSubscribeVoSchema = exports.GET_COMMENT_SUBSCRIBE = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.GET_COMMENT_SUBSCRIBE = '/comment/{tableId}/{recordId}/subscribe';
exports.commentSubscribeVoSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    recordId: zod_1.z.string(),
    createdBy: zod_1.z.string(),
});
exports.GetCommentSubscribeRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_COMMENT_SUBSCRIBE,
    description: 'get record comment subscribe detail',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successfully get record comment subscribe detail.',
            content: {
                'application/json': {
                    schema: exports.commentSubscribeVoSchema.nullable(),
                },
            },
        },
    },
    tags: ['comment'],
});
const getCommentSubscribe = async (tableId, recordId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_COMMENT_SUBSCRIBE, { tableId, recordId }));
};
exports.getCommentSubscribe = getCommentSubscribe;
