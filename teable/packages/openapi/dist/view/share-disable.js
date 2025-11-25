"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableShareView = exports.DisableShareViewRoute = exports.DISABLE_SHARE_VIEW = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DISABLE_SHARE_VIEW = '/table/{tableId}/view/{viewId}/disable-share';
exports.DisableShareViewRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DISABLE_SHARE_VIEW,
    description: 'Disable view share',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns successfully disable view share',
        },
    },
    tags: ['view'],
});
const disableShareView = (params) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DISABLE_SHARE_VIEW, params));
};
exports.disableShareView = disableShareView;
