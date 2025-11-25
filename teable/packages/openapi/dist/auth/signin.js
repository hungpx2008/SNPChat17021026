"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.SigninRoute = exports.signinSchema = exports.SIGN_IN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
const user_me_1 = require("./user-me");
exports.SIGN_IN = '/auth/signin';
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase(),
    password: types_1.passwordSchema,
    turnstileToken: zod_1.z.string().optional(),
});
exports.SigninRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SIGN_IN,
    description: 'Sign in',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.signinSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Sign in successfully',
            content: {
                'application/json': {
                    schema: user_me_1.userMeVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const signin = async (body) => {
    return axios_1.axios.post(exports.SIGN_IN, body);
};
exports.signin = signin;
