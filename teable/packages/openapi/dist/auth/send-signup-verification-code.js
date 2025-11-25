"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignupVerificationCode = exports.sendSignupVerificationCodeRoute = exports.sendSignupVerificationCodeVoSchema = exports.sendSignupVerificationCodeRoSchema = exports.SEND_SIGNUP_VERIFICATION_CODE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SEND_SIGNUP_VERIFICATION_CODE = '/auth/send-signup-verification-code';
exports.sendSignupVerificationCodeRoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    turnstileToken: zod_1.z.string().optional(),
});
exports.sendSignupVerificationCodeVoSchema = zod_1.z.object({
    token: zod_1.z.string(),
    expiresTime: zod_1.z.string(),
});
exports.sendSignupVerificationCodeRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SEND_SIGNUP_VERIFICATION_CODE,
    description: 'Send signup verification code',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.sendSignupVerificationCodeRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Resend signup verification code successfully',
            content: {
                'application/json': {
                    schema: exports.sendSignupVerificationCodeVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const sendSignupVerificationCode = (email, turnstileToken) => axios_1.axios.post(exports.SEND_SIGNUP_VERIFICATION_CODE, {
    email,
    turnstileToken,
});
exports.sendSignupVerificationCode = sendSignupVerificationCode;
