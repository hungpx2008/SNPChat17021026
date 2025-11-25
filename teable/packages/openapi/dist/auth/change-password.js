"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.ChangePasswordRoute = exports.changePasswordRoSchema = exports.CHANGE_PASSWORD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.CHANGE_PASSWORD = '/auth/change-password';
exports.changePasswordRoSchema = zod_1.z.object({
    password: types_1.passwordSchema,
    newPassword: types_1.signupPasswordSchema,
});
exports.ChangePasswordRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.CHANGE_PASSWORD,
    description: 'Change password',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.changePasswordRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Change password successfully',
        },
    },
    tags: ['auth'],
});
const changePassword = async (body) => {
    return axios_1.axios.patch(exports.CHANGE_PASSWORD, body);
};
exports.changePassword = changePassword;
