"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPassword = exports.addPasswordRoute = exports.addPasswordRoSchema = exports.ADD_PASSWORD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.ADD_PASSWORD = '/auth/add-password';
exports.addPasswordRoSchema = zod_1.z.object({
    password: types_1.signupPasswordSchema,
});
exports.addPasswordRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ADD_PASSWORD,
    description: 'Add password',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.addPasswordRoSchema,
                },
            },
        },
    },
    tags: ['auth'],
    responses: {
        201: {
            description: 'Successfully added password',
        },
    },
});
const addPassword = async (ro) => {
    return axios_1.axios.post(exports.ADD_PASSWORD, ro);
};
exports.addPassword = addPassword;
