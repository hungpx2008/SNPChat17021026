"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetPasswordRoute = exports.resetPasswordRoSchema = exports.RESET_PASSWORD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.RESET_PASSWORD = '/auth/reset-password';
exports.resetPasswordRoSchema = zod_1.z.object({
    password: types_1.signupPasswordSchema,
    code: zod_1.z.string(),
});
exports.resetPasswordRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.RESET_PASSWORD,
    description: 'Reset password',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.resetPasswordRoSchema,
                },
            },
        },
    },
    tags: ['auth'],
    responses: {
        201: {
            description: 'Successfully reset password',
        },
    },
});
const resetPassword = async (ro) => {
    return axios_1.axios.post(exports.RESET_PASSWORD, ro);
};
exports.resetPassword = resetPassword;
