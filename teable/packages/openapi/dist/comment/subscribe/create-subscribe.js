"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSubscribe = exports.CreateCommentSubscribeRoute = exports.CREATE_COMMENT_SUBSCRIBE = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.CREATE_COMMENT_SUBSCRIBE = '/comment/{tableId}/{recordId}/subscribe';
exports.CreateCommentSubscribeRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_COMMENT_SUBSCRIBE,
    description: "subscribe record comment's active",
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Successfully subscribe record comment.',
        },
    },
    tags: ['comment'],
});
const createCommentSubscribe = async (tableId, recordId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_COMMENT_SUBSCRIBE, { tableId, recordId }));
};
exports.createCommentSubscribe = createCommentSubscribe;
