"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStatusCollection = exports.GetTaskStatusCollectionRoute = exports.GET_TASK_STATUS_COLLECTION = exports.taskStatusCollectionVoSchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.taskStatusCollectionVoSchema = zod_1.z.object({
    cells: zod_1.z
        .object({
        recordId: zod_1.z.string(),
        fieldId: zod_1.z.string(),
    })
        .array(),
    fieldMap: zod_1.z.record(zod_1.z.string().startsWith(core_1.IdPrefix.Field), zod_1.z.object({
        taskId: zod_1.z.string().startsWith(core_1.IdPrefix.Task),
        completedCount: zod_1.z.number(),
        totalCount: zod_1.z.number(),
    })),
});
exports.GET_TASK_STATUS_COLLECTION = '/table/{tableId}/aggregation/task-status-collection';
exports.GetTaskStatusCollectionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TASK_STATUS_COLLECTION,
    summary: 'Get task status collection',
    description: 'Returns records and count distribution across task status based on specified date range and fields',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Task status collection for the view',
            content: {
                'application/json': {
                    schema: exports.taskStatusCollectionVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getTaskStatusCollection = async (tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TASK_STATUS_COLLECTION, { tableId }));
};
exports.getTaskStatusCollection = getTaskStatusCollection;
