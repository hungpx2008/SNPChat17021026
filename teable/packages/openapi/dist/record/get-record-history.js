"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordHistory = exports.GetRecordHistoryRoute = exports.GET_RECORD_HISTORY_URL = exports.recordHistoryVoSchema = exports.recordHistoryItemVoSchema = exports.recordHistoryItemStateVoSchema = exports.getRecordHistoryQuerySchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const trash_1 = require("../trash");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.getRecordHistoryQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    cursor: zod_1.z.string().nullish(),
});
exports.recordHistoryItemStateVoSchema = zod_1.z.object({
    meta: core_1.fieldVoSchema
        .pick({
        name: true,
        type: true,
        cellValueType: true,
        isLookup: true,
        isConditionalLookup: true,
    })
        .merge(zod_1.z.object({
        options: zod_1.z.unknown(),
    })),
    data: zod_1.z.unknown(),
});
exports.recordHistoryItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    tableId: zod_1.z.string(),
    recordId: zod_1.z.string(),
    fieldId: zod_1.z.string(),
    before: exports.recordHistoryItemStateVoSchema,
    after: exports.recordHistoryItemStateVoSchema,
    createdTime: zod_1.z.string(),
    createdBy: zod_1.z.string(),
});
exports.recordHistoryVoSchema = zod_1.z.object({
    historyList: zod_1.z.array(exports.recordHistoryItemVoSchema),
    userMap: trash_1.userMapVoSchema,
    nextCursor: zod_1.z.string().nullish(),
});
exports.GET_RECORD_HISTORY_URL = '/table/{tableId}/record/{recordId}/history';
exports.GetRecordHistoryRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORD_HISTORY_URL,
    summary: 'Get record history',
    description: 'Retrieve the change history of a specific record, including field modifications and user information.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Get the history list for a record',
            content: {
                'application/json': {
                    schema: exports.recordHistoryVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
const getRecordHistory = async (tableId, recordId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORD_HISTORY_URL, {
        tableId,
        recordId,
    }), { params: query });
};
exports.getRecordHistory = getRecordHistory;
