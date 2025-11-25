"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAggregation = exports.GetAggregationRoute = exports.GET_AGGREGATION_LIST = exports.aggregationVoSchema = exports.rawAggregationValueSchema = exports.baseRawAggregationValueSchema = exports.rawAggregationsSchema = exports.rawAggregationsValueSchema = exports.aggFuncSchema = exports.aggregationRoSchema = exports.aggregationFieldSchema = exports.StatisticsFunc = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
var core_2 = require("@teable/core");
Object.defineProperty(exports, "StatisticsFunc", { enumerable: true, get: function () { return core_2.StatisticsFunc; } });
exports.aggregationFieldSchema = zod_1.z.object({
    fieldId: zod_1.z.string(),
    statisticFunc: zod_1.z.nativeEnum(core_1.StatisticsFunc),
    alias: zod_1.z.string().optional(),
});
exports.aggregationRoSchema = record_1.queryBaseSchema
    .merge(record_1.contentQueryBaseSchema.pick({ groupBy: true }))
    .extend({
    field: zod_1.z.record(zod_1.z.nativeEnum(core_1.StatisticsFunc), zod_1.z.string().array()).optional(),
});
exports.aggFuncSchema = zod_1.z.nativeEnum(core_1.StatisticsFunc);
exports.rawAggregationsValueSchema = zod_1.z.object({
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).nullable(),
    aggFunc: exports.aggFuncSchema,
});
exports.rawAggregationsSchema = zod_1.z
    .object({
    fieldId: zod_1.z.string().startsWith(core_1.IdPrefix.Field).openapi({
        description: 'The id of the field.',
    }),
    total: exports.rawAggregationsValueSchema.nullable().openapi({
        description: 'Aggregations by all data in field',
    }),
    group: zod_1.z.record(zod_1.z.string(), exports.rawAggregationsValueSchema).optional().nullable().openapi({
        description: 'Aggregations by grouped data in field',
    }),
})
    .array();
exports.baseRawAggregationValueSchema = zod_1.z.object({
    viewId: zod_1.z.string().startsWith(core_1.IdPrefix.View),
    aggregations: exports.rawAggregationsSchema,
    rowCount: zod_1.z.number(),
});
exports.rawAggregationValueSchema = exports.baseRawAggregationValueSchema
    .pick({
    aggregations: true,
})
    .partial();
exports.aggregationVoSchema = exports.rawAggregationValueSchema;
exports.GET_AGGREGATION_LIST = '/table/{tableId}/aggregation';
exports.GetAggregationRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_AGGREGATION_LIST,
    summary: 'Get aggregated statistics',
    description: 'Returns statistical aggregations of table data based on specified functions and grouping criteria',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: zod_1.z.object({}),
    },
    responses: {
        200: {
            description: 'Returns aggregations list.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.aggregationVoSchema),
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getAggregation = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_AGGREGATION_LIST, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            groupBy: JSON.stringify(query?.groupBy),
        },
    });
};
exports.getAggregation = getAggregation;
