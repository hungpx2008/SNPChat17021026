"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.SignupRoute = exports.signupSchema = exports.refMetaSchema = exports.SIGN_UP = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const signin_1 = require("./signin");
const types_1 = require("./types");
const user_me_1 = require("./user-me");
exports.SIGN_UP = '/auth/signup';
exports.refMetaSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    referer: zod_1.z.string().optional(),
});
exports.signupSchema = signin_1.signinSchema.merge(zod_1.z.object({
    defaultSpaceName: zod_1.z.string().optional(),
    refMeta: exports.refMetaSchema.optional(),
    password: types_1.signupPasswordSchema,
    verification: zod_1.z
        .object({
        code: zod_1.z.string(),
        token: zod_1.z.string(),
    })
        .optional(),
    inviteCode: zod_1.z.string().optional(),
    turnstileToken: zod_1.z.string().optional(),
}));
exports.SignupRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SIGN_UP,
    description: 'Sign up',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.signupSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Sign up and sing in successfully',
            content: {
                'application/json': {
                    schema: user_me_1.userMeVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const signup = async (body) => {
    return axios_1.axios.post(exports.SIGN_UP, body);
};
exports.signup = signup;
