"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeEmail = exports.changeEmailRoute = exports.changeEmailRoSchema = exports.CHANGE_EMAIL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CHANGE_EMAIL = '/auth/change-email';
exports.changeEmailRoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    token: zod_1.z.string(),
    code: zod_1.z.string(),
});
exports.changeEmailRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.CHANGE_EMAIL,
    description: 'Change email',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.changeEmailRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Change email successfully',
        },
    },
    tags: ['auth'],
});
const changeEmail = async (ro) => {
    return axios_1.axios.patch(exports.CHANGE_EMAIL, ro);
};
exports.changeEmail = changeEmail;
