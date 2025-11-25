"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportUnsubscribeList = exports.exportUnsubscribeListRoute = exports.EXPORT_UNSUBSCRIBE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.EXPORT_UNSUBSCRIBE_LIST = '/unsubscribe/export-list/{baseId}';
exports.exportUnsubscribeListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.EXPORT_UNSUBSCRIBE_LIST,
    description: 'Export unsubscribe list',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Export unsubscribe list successfully',
        },
    },
    tags: ['unsubscribe'],
});
const exportUnsubscribeList = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.EXPORT_UNSUBSCRIBE_LIST, { baseId }));
};
exports.exportUnsubscribeList = exportUnsubscribeList;
