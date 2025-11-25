"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationReadAll = exports.NotificationReadALlRoute = exports.NOTIFICATION_READ_ALL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.NOTIFICATION_READ_ALL = '/notifications/read-all';
exports.NotificationReadALlRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.NOTIFICATION_READ_ALL,
    description: 'mark all notifications as read',
    responses: {
        200: {
            description: 'Returns successfully',
        },
    },
    tags: ['notification'],
});
const notificationReadAll = async () => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.NOTIFICATION_READ_ALL));
};
exports.notificationReadAll = notificationReadAll;
