"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationList = exports.NotificationListRoute = exports.notificationVoSchema = exports.notificationListVoSchema = exports.getNotifyListQuerySchema = exports.NOTIFICATION_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.NOTIFICATION_LIST = '/notifications';
exports.getNotifyListQuerySchema = zod_1.z.object({
    notifyStates: zod_1.z.nativeEnum(core_1.NotificationStatesEnum),
    cursor: zod_1.z.string().nullish(),
});
exports.notificationListVoSchema = zod_1.z.array(core_1.notificationSchema);
exports.notificationVoSchema = zod_1.z.object({
    notifications: exports.notificationListVoSchema,
    nextCursor: zod_1.z.string().nullish(),
});
exports.NotificationListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.NOTIFICATION_LIST,
    description: 'List a user notification',
    request: {
        query: exports.getNotifyListQuerySchema,
    },
    responses: {
        200: {
            description: 'Successful response, return user notification list.',
            content: {
                'application/json': {
                    schema: exports.notificationVoSchema,
                },
            },
        },
    },
    tags: ['notification'],
});
const getNotificationList = async (query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.NOTIFICATION_LIST), { params: query });
};
exports.getNotificationList = getNotificationList;
