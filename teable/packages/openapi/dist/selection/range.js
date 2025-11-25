"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdsFromRanges = exports.GetIdsFromRangesRoute = exports.rangesToIdVoSchema = exports.rangesToIdQuerySchema = exports.IdReturnType = exports.rangesQuerySchema = exports.rangesRoSchema = exports.rangesSchema = exports.cellSchema = exports.RangeType = exports.GET_IDS_FROM_RANGES_URL = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_IDS_FROM_RANGES_URL = '/table/{tableId}/selection/range-to-id';
var RangeType;
(function (RangeType) {
    RangeType["Rows"] = "rows";
    RangeType["Columns"] = "columns";
})(RangeType || (exports.RangeType = RangeType = {}));
exports.cellSchema = zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]);
const rangeTypeSchema = zod_1.z.nativeEnum(RangeType).optional().openapi({
    description: 'Types of non-contiguous selections',
    example: RangeType.Columns,
});
exports.rangesSchema = zod_1.z.array(exports.cellSchema).min(1, {
    message: 'The range parameter must be a valid 2D array with even length.',
});
exports.rangesRoSchema = record_1.contentQueryBaseSchema.extend({
    filter: core_1.filterSchema.optional(),
    orderBy: record_1.orderBySchema.optional(),
    groupBy: core_1.groupSchema.optional(),
    collapsedGroupIds: zod_1.z.array(zod_1.z.string()).optional(),
    projection: zod_1.z.array(zod_1.z.string().startsWith(core_1.IdPrefix.Field)).optional().openapi({
        description: 'If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained',
    }),
    ranges: exports.rangesSchema.openapi({
        description: 'The parameter "ranges" is used to represent the coordinates of a selected range in a table. ',
        example: [
            [0, 0],
            [1, 1],
        ],
    }),
    type: rangeTypeSchema,
});
exports.rangesQuerySchema = record_1.contentQueryBaseSchema.extend({
    projection: zod_1.z.array(zod_1.z.string().startsWith(core_1.IdPrefix.Field)).optional().openapi({
        description: 'If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained',
    }),
    ranges: zod_1.z
        .string()
        .transform((value, ctx) => {
        const parsingResult = exports.rangesSchema.safeParse(JSON.parse(value));
        if (!parsingResult.success) {
            parsingResult.error.issues.forEach((issue) => {
                ctx.addIssue(issue);
            });
            return zod_1.z.NEVER;
        }
        return parsingResult.data;
    })
        .openapi({
        type: 'string',
        description: 'The parameter "ranges" is used to represent the coordinates [column, row][] of a selected range in a table. ',
        example: '[[0, 0], [1, 1]]',
    }),
    type: rangeTypeSchema,
});
var IdReturnType;
(function (IdReturnType) {
    IdReturnType["RecordId"] = "recordId";
    IdReturnType["FieldId"] = "fieldId";
    IdReturnType["All"] = "all";
})(IdReturnType || (exports.IdReturnType = IdReturnType = {}));
exports.rangesToIdQuerySchema = exports.rangesQuerySchema.extend({
    returnType: zod_1.z.nativeEnum(IdReturnType).openapi({ description: 'Define which Id to return.' }),
});
exports.rangesToIdVoSchema = zod_1.z.object({
    recordIds: zod_1.z.array(zod_1.z.string()).optional(),
    fieldIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.GetIdsFromRangesRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_IDS_FROM_RANGES_URL,
    summary: 'Get ids from range',
    description: 'Retrieve record and field identifiers based on the selected range coordinates in a table',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.rangesToIdQuerySchema,
    },
    responses: {
        200: {
            description: 'Copy content',
            content: {
                'application/json': {
                    schema: exports.rangesToIdVoSchema,
                },
            },
        },
    },
    tags: ['selection'],
});
const getIdsFromRanges = async (tableId, rangesToIdQuery) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_IDS_FROM_RANGES_URL, {
        tableId,
    }), {
        params: {
            ...rangesToIdQuery,
            filter: JSON.stringify(rangesToIdQuery.filter),
            orderBy: JSON.stringify(rangesToIdQuery.orderBy),
            ranges: JSON.stringify(rangesToIdQuery.ranges),
        },
    });
};
exports.getIdsFromRanges = getIdsFromRanges;
