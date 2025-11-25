"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationStatus = exports.UpdateNotificationStatusRoute = exports.updateNotifyStatusRoSchema = exports.UPDATE_NOTIFICATION_STATUS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_NOTIFICATION_STATUS = '/notifications/{notificationId}/status';
exports.updateNotifyStatusRoSchema = zod_1.z.object({
    isRead: zod_1.z.boolean(),
});
exports.UpdateNotificationStatusRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_NOTIFICATION_STATUS,
    description: 'Patch notification status',
    request: {
        params: zod_1.z.object({
            notificationId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateNotifyStatusRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns successfully patch notification status',
        },
    },
    tags: ['notification'],
});
const updateNotificationStatus = async (params) => {
    const { notificationId, updateNotifyStatusRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_NOTIFICATION_STATUS, { notificationId }), updateNotifyStatusRo);
};
exports.updateNotificationStatus = updateNotificationStatus;
