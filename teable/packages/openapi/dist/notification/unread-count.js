"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationUnreadCount = exports.NotificationUnreadCountRoute = exports.notificationUnreadCountVoSchema = exports.NOTIFICATION_UNREAD_COUNT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.NOTIFICATION_UNREAD_COUNT = '/notifications/unread-count';
exports.notificationUnreadCountVoSchema = zod_1.z.object({
    unreadCount: zod_1.z.number().nonnegative().int(),
});
exports.NotificationUnreadCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.NOTIFICATION_UNREAD_COUNT,
    description: 'User notification unread count',
    responses: {
        200: {
            description: 'Successful response, return user notification unread count.',
            content: {
                'application/json': {
                    schema: exports.notificationUnreadCountVoSchema,
                },
            },
        },
    },
    tags: ['notification'],
});
const getNotificationUnreadCount = async () => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.NOTIFICATION_UNREAD_COUNT));
};
exports.getNotificationUnreadCount = getNotificationUnreadCount;
