"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareViewCopy = exports.ShareViewCopyRoute = exports.SHARE_VIEW_COPY = void 0;
const axios_1 = require("../axios");
const selection_1 = require("../selection");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_COPY = '/share/{shareId}/view/copy';
exports.ShareViewCopyRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_COPY,
    description: 'Copy operations in Share view',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: selection_1.rangesQuerySchema,
    },
    responses: {
        200: {
            description: 'Copy content',
            content: {
                'application/json': {
                    schema: selection_1.copyVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const shareViewCopy = async (shareId, copyRo) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_COPY, {
        shareId,
    }), {
        params: {
            ...copyRo,
            filter: JSON.stringify(copyRo.filter),
            orderBy: JSON.stringify(copyRo.orderBy),
            ranges: JSON.stringify(copyRo.ranges),
            groupBy: JSON.stringify(copyRo.groupBy),
            collapsedGroupIds: JSON.stringify(copyRo.collapsedGroupIds),
        },
    });
};
exports.shareViewCopy = shareViewCopy;
