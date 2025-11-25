"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserNotifyMeta = exports.UpdateUserNotifyMetaRoute = exports.userNotifyMetaSchema = exports.UPDATE_USER_NOTIFY_META = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_USER_NOTIFY_META = '/user/notify-meta';
exports.userNotifyMetaSchema = zod_1.z.object({
    email: zod_1.z.boolean().optional(),
});
exports.UpdateUserNotifyMetaRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_USER_NOTIFY_META,
    description: 'Update user notification meta',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.userNotifyMetaSchema,
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
const updateUserNotifyMeta = async (updateUserNotifyMetaRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_USER_NOTIFY_META), updateUserNotifyMetaRo);
};
exports.updateUserNotifyMeta = updateUserNotifyMeta;
