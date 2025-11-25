"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordStatus = exports.GetRecordStatusRoute = exports.recordStatusVoSchema = exports.GET_RECORD_STATUS_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_list_1 = require("./get-list");
exports.GET_RECORD_STATUS_URL = '/table/{tableId}/record/{recordId}/status';
exports.recordStatusVoSchema = zod_1.z.object({
    isVisible: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean(),
});
exports.GetRecordStatusRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORD_STATUS_URL,
    summary: 'Get record status',
    description: 'Retrieve the visibility and deletion status of a specific record.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        query: get_list_1.getRecordsRoSchema,
    },
    responses: {
        200: {
            description: 'List of records',
            content: {
                'application/json': {
                    schema: exports.recordStatusVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
const getRecordStatus = (tableId, recordId, query) => {
    const serializedQuery = {
        ...query,
        filter: query?.filter ? JSON.stringify(query.filter) : undefined,
        orderBy: query?.orderBy ? JSON.stringify(query.orderBy) : undefined,
        groupBy: query?.groupBy ? JSON.stringify(query.groupBy) : undefined,
        collapsedGroupIds: query?.collapsedGroupIds
            ? JSON.stringify(query.collapsedGroupIds)
            : undefined,
    };
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORD_STATUS_URL, { tableId, recordId }), {
        params: serializedQuery,
    });
};
exports.getRecordStatus = getRecordStatus;
