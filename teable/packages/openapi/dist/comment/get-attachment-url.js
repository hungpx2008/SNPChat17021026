"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentAttachmentUrl = exports.GetCommentAttachmentUrlRoute = exports.GET_COMMENT_ATTACHMENT_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_COMMENT_ATTACHMENT_URL = '/comment/{tableId}/{recordId}/attachment/{path}';
exports.GetCommentAttachmentUrlRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_COMMENT_ATTACHMENT_URL,
    description: 'Get record comment attachment url',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: "Returns the record's comment attachment url",
            content: {
                'application/json': {
                    schema: zod_1.z.string(),
                },
            },
        },
    },
    tags: ['comment'],
});
const getCommentAttachmentUrl = async (tableId, recordId, path) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_COMMENT_ATTACHMENT_URL, { tableId, recordId, path }));
};
exports.getCommentAttachmentUrl = getCommentAttachmentUrl;
