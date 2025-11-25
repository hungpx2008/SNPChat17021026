"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSelection = exports.DeleteRoute = exports.deleteVoSchema = exports.DELETE_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const range_1 = require("./range");
exports.DELETE_URL = '/table/{tableId}/selection/delete';
exports.deleteVoSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()),
});
exports.DeleteRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_URL,
    summary: 'Delete selected range data',
    description: 'Delete records or fields within the selected table range',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: range_1.rangesQuerySchema,
    },
    responses: {
        200: {
            description: 'Successful deletion',
            content: {
                'application/json': {
                    schema: exports.deleteVoSchema,
                },
            },
        },
    },
    tags: ['selection'],
});
const deleteSelection = async (tableId, deleteRo) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_URL, {
        tableId,
    }), {
        params: {
            ...deleteRo,
            filter: JSON.stringify(deleteRo.filter),
            orderBy: JSON.stringify(deleteRo.orderBy),
            groupBy: JSON.stringify(deleteRo.groupBy),
            ranges: JSON.stringify(deleteRo.ranges),
            collapsedGroupIds: JSON.stringify(deleteRo.collapsedGroupIds),
        },
    });
};
exports.deleteSelection = deleteSelection;
