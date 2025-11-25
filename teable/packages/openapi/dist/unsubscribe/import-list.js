"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUnsubscribeList = exports.importUnsubscribeListRoute = exports.importUnsubscribeListRoSchema = exports.IMPORT_UNSUBSCRIBE_LIST = void 0;
const attachment_1 = require("../attachment");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.IMPORT_UNSUBSCRIBE_LIST = '/unsubscribe/import-list/{baseId}';
exports.importUnsubscribeListRoSchema = zod_1.z.object({
    notify: attachment_1.notifyVoSchema,
});
exports.importUnsubscribeListRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.IMPORT_UNSUBSCRIBE_LIST,
    description: 'Import unsubscribe list',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.importUnsubscribeListRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: zod_1.z.boolean(),
                },
            },
        },
    },
    tags: ['unsubscribe'],
});
const importUnsubscribeList = async (baseId, importUnsubscribeListRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.IMPORT_UNSUBSCRIBE_LIST, { baseId }), importUnsubscribeListRo);
};
exports.importUnsubscribeList = importUnsubscribeList;
