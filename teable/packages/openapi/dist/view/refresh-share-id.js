"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshViewShareId = exports.refreshViewShareIdRoute = exports.refreshShareViewVoSchema = exports.REFRESH_SHARE_ID = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.REFRESH_SHARE_ID = '/table/{tableId}/view/{viewId}/refresh-share-id';
exports.refreshShareViewVoSchema = zod_1.z.object({
    shareId: zod_1.z.string(),
});
exports.refreshViewShareIdRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.REFRESH_SHARE_ID,
    description: 'Refresh view share id',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns successfully refreshed view share id',
            content: {
                'application/json': {
                    schema: exports.refreshShareViewVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const refreshViewShareId = async (tableId, viewId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.REFRESH_SHARE_ID, {
        tableId,
        viewId,
    }));
};
exports.refreshViewShareId = refreshViewShareId;
