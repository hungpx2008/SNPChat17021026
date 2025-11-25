"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewFilterLinkRecords = exports.GetViewFilterLinkRecordsRoute = exports.getViewFilterLinkRecordsVoSchema = exports.GET_VIEW_FILTER_LINK_RECORDS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_VIEW_FILTER_LINK_RECORDS = '/table/{tableId}/view/{viewId}/filter-link-records';
exports.getViewFilterLinkRecordsVoSchema = zod_1.z.array(zod_1.z.object({
    tableId: zod_1.z.string(),
    records: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string().optional(),
    })),
}));
exports.GetViewFilterLinkRecordsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_VIEW_FILTER_LINK_RECORDS,
    description: 'Getting associated records for a view filter configuration.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the view to filter the configured records.',
            content: {
                'application/json': {
                    schema: exports.getViewFilterLinkRecordsVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const getViewFilterLinkRecords = async (tableId, viewId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_VIEW_FILTER_LINK_RECORDS, { tableId, viewId }));
};
exports.getViewFilterLinkRecords = getViewFilterLinkRecords;
