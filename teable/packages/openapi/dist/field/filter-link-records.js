"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldFilterLinkRecords = exports.GetFieldFilterLinkRecordsRoute = exports.getFieldFilterLinkRecordsVoSchema = exports.GET_FIELD_FILTER_LINK_RECORDS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const filter_link_records_1 = require("../view/filter-link-records");
const zod_1 = require("../zod");
exports.GET_FIELD_FILTER_LINK_RECORDS = '/table/{tableId}/field/{fieldId}/filter-link-records';
exports.getFieldFilterLinkRecordsVoSchema = filter_link_records_1.getViewFilterLinkRecordsVoSchema;
exports.GetFieldFilterLinkRecordsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_FIELD_FILTER_LINK_RECORDS,
    summary: 'Get linked records for filter',
    description: 'Retrieve associated records that match the view filter configuration for a linked field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the link field to filter the configured records.',
            content: {
                'application/json': {
                    schema: exports.getFieldFilterLinkRecordsVoSchema,
                },
            },
        },
    },
    tags: ['field'],
});
const getFieldFilterLinkRecords = async (tableId, fieldId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_FIELD_FILTER_LINK_RECORDS, { tableId, fieldId }));
};
exports.getFieldFilterLinkRecords = getFieldFilterLinkRecords;
