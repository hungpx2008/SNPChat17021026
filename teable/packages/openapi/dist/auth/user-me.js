"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMe = exports.userMeRoute = exports.userMeVoSchema = exports.USER_ME = void 0;
const axios_1 = require("../axios");
const user_1 = require("../user");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.USER_ME = '/auth/user/me';
exports.userMeVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    avatar: zod_1.z.string().nullable().optional(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().nullable().optional(),
    notifyMeta: user_1.userNotifyMetaSchema,
    hasPassword: zod_1.z.boolean(),
    isAdmin: zod_1.z.boolean().nullable().optional(),
    organization: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        departments: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
        })),
        isAdmin: zod_1.z.boolean().optional(),
    })
        .optional(),
});
exports.userMeRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.USER_ME,
    description: 'Get user information',
    responses: {
        200: {
            description: 'Successfully retrieved user information',
            content: {
                'application/json': {
                    schema: exports.userMeVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const userMe = async () => {
    return axios_1.axios.get(exports.USER_ME);
};
exports.userMe = userMe;
