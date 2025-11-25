"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowCount = exports.GetRowCountRoute = exports.GET_ROW_COUNT = exports.rowCountVoSchema = exports.rawRowCountValueSchema = void 0;
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_aggregation_1 = require("./get-aggregation");
exports.rawRowCountValueSchema = get_aggregation_1.baseRawAggregationValueSchema.pick({
    rowCount: true,
});
exports.rowCountVoSchema = exports.rawRowCountValueSchema;
exports.GET_ROW_COUNT = '/table/{tableId}/aggregation/row-count';
exports.GetRowCountRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_ROW_COUNT,
    summary: 'Get total row count',
    description: 'Returns the total number of rows in a view based on applied filters and criteria',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: record_1.queryBaseSchema,
    },
    responses: {
        200: {
            description: 'Row count for the view',
            content: {
                'application/json': {
                    schema: exports.rowCountVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getRowCount = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_ROW_COUNT, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
        },
    });
};
exports.getRowCount = getRowCount;
