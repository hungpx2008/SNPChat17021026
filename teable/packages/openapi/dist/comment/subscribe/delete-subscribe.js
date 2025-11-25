"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentSubscribe = exports.DeleteCommentSubscribeRoute = exports.DELETE_COMMENT_SUBSCRIBE = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.DELETE_COMMENT_SUBSCRIBE = '/comment/{tableId}/{recordId}/subscribe';
exports.DeleteCommentSubscribeRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_COMMENT_SUBSCRIBE,
    description: 'unsubscribe record comment',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successfully subscribe record comment.',
        },
    },
    tags: ['comment'],
});
const deleteCommentSubscribe = async (tableId, recordId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_COMMENT_SUBSCRIBE, { tableId, recordId }));
};
exports.deleteCommentSubscribe = deleteCommentSubscribe;
