"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChangeEmailCode = exports.SendChangeEmailCodeRoute = exports.sendChangeEmailCodeVoSchema = exports.sendChangeEmailCodeRoSchema = exports.SEND_CHANGE_EMAIL_CODE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SEND_CHANGE_EMAIL_CODE = '/auth/send-change-email-code';
exports.sendChangeEmailCodeRoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.sendChangeEmailCodeVoSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.SendChangeEmailCodeRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SEND_CHANGE_EMAIL_CODE,
    description: 'Send change email code',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.sendChangeEmailCodeRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Send change email code successfully',
            content: {
                'application/json': {
                    schema: exports.sendChangeEmailCodeVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const sendChangeEmailCode = async (ro) => {
    return axios_1.axios.post(exports.SEND_CHANGE_EMAIL_CODE, ro);
};
exports.sendChangeEmailCode = sendChangeEmailCode;
