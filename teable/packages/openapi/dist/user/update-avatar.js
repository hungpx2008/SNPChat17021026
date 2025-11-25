"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAvatar = exports.UpdateUserAvatarRoute = exports.updateUserAvatarRoSchema = exports.UPDATE_USER_AVATAR = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_USER_AVATAR = '/user/avatar';
exports.updateUserAvatarRoSchema = zod_1.z.object({
    file: zod_1.z.string().openapi({ format: 'binary' }),
});
exports.UpdateUserAvatarRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_USER_AVATAR,
    description: 'Update user avatar',
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: exports.updateUserAvatarRoSchema,
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
const updateUserAvatar = async (updateUserAvatarRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_USER_AVATAR), updateUserAvatarRo);
};
exports.updateUserAvatar = updateUserAvatar;
