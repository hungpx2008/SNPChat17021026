"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfo = exports.userInfoRoute = exports.userInfoVoSchema = exports.USER_INFO = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.USER_INFO = '/auth/user';
exports.userInfoVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    avatar: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional(),
});
exports.userInfoRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.USER_INFO,
    description: 'Get user information via access token',
    responses: {
        200: {
            description: 'Successfully retrieved user information',
            content: {
                'application/json': {
                    schema: exports.userInfoVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const userInfo = async () => {
    return axios_1.axios.get(exports.USER_INFO);
};
exports.userInfo = userInfo;
