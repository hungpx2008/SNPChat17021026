"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableShareView = exports.EnableShareViewRoute = exports.enableShareViewVoSchema = exports.ENABLE_SHARE_VIEW = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.ENABLE_SHARE_VIEW = '/table/{tableId}/view/{viewId}/enable-share';
exports.enableShareViewVoSchema = zod_1.z.object({
    shareId: zod_1.z.string(),
});
exports.EnableShareViewRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ENABLE_SHARE_VIEW,
    description: 'Enable view share',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns successfully enable view share',
            content: {
                'application/json': {
                    schema: exports.enableShareViewVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const enableShareView = (params) => {
    const { tableId, viewId } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.ENABLE_SHARE_VIEW, { tableId, viewId }));
};
exports.enableShareView = enableShareView;
