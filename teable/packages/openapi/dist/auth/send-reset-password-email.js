"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendResetPasswordEmailRoute = exports.sendResetPasswordEmailRoSchema = exports.SEND_RESET_PASSWORD_EMAIL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SEND_RESET_PASSWORD_EMAIL = '/auth/send-reset-password-email';
exports.sendResetPasswordEmailRoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.sendResetPasswordEmailRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SEND_RESET_PASSWORD_EMAIL,
    description: 'Send reset password email',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.sendResetPasswordEmailRoSchema,
                },
            },
        },
    },
    tags: ['auth'],
    responses: {
        201: {
            description: 'Successfully sent reset password email',
        },
    },
});
const sendResetPasswordEmail = async (ro) => {
    return axios_1.axios.post(exports.SEND_RESET_PASSWORD_EMAIL, ro);
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
