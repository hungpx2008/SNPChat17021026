"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareViewAuth = exports.ShareViewAuthRouter = exports.shareViewAuthVoSchema = exports.SHARE_VIEW_AUTH = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_AUTH = '/share/{shareId}/view/auth';
exports.shareViewAuthVoSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.ShareViewAuthRouter = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SHARE_VIEW_AUTH,
    description: 'share view auth password',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: zod_1.z.object({
                        password: core_1.sharePasswordSchema,
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully authenticated',
            content: {
                'application/json': {
                    schema: exports.shareViewAuthVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const shareViewAuth = (params) => {
    const { shareId, password } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.SHARE_VIEW_AUTH, { shareId }), { password });
};
exports.shareViewAuth = shareViewAuth;
