"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserName = exports.UpdateUserNameRoute = exports.updateUserNameRoSchema = exports.UPDATE_USER_NAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_USER_NAME = '/user/name';
exports.updateUserNameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.UpdateUserNameRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_USER_NAME,
    description: 'Update user name',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.updateUserNameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully update.',
        },
    },
    tags: ['user'],
});
const updateUserName = async (updateUserNameRo) => {
    return axios_1.axios.patch(exports.UPDATE_USER_NAME, updateUserNameRo);
};
exports.updateUserName = updateUserName;
