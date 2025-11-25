"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordListHistory = exports.GetRecordListHistoryRoute = exports.GET_RECORD_LIST_HISTORY_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_record_history_1 = require("./get-record-history");
exports.GET_RECORD_LIST_HISTORY_URL = '/table/{tableId}/record/history';
exports.GetRecordListHistoryRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORD_LIST_HISTORY_URL,
    summary: 'Get table records history',
    description: 'Retrieve the change history of all records in a table, including field modifications and user information.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Get the history list of all records in a table',
            content: {
                'application/json': {
                    schema: get_record_history_1.recordHistoryVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
const getRecordListHistory = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORD_LIST_HISTORY_URL, {
        tableId,
    }), { params: query });
};
exports.getRecordListHistory = getRecordListHistory;
