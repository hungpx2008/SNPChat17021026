"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.SignoutRoute = exports.SING_OUT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.SING_OUT = '/auth/signout';
exports.SignoutRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SING_OUT,
    description: 'Sign out',
    responses: {
        201: {
            description: 'Sign out successfully',
        },
    },
    tags: ['auth'],
});
const signout = async () => {
    return axios_1.axios.post(exports.SING_OUT);
};
exports.signout = signout;
