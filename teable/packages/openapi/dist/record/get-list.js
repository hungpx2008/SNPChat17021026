"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecords = exports.GetRecordsRoute = exports.GET_RECORDS_URL = exports.recordsVoSchema = exports.recordsSchema = exports.getRecordsRoSchema = exports.contentQueryBaseSchema = exports.orderBySchema = exports.queryBaseSchema = void 0;
const core_1 = require("@teable/core");
const type_1 = require("../aggregation/type");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
const defaultPageSize = 100;
const maxPageSize = 2000;
exports.queryBaseSchema = zod_1.z.object({
    viewId: zod_1.z.string().startsWith(core_1.IdPrefix.View).optional().openapi({
        example: 'viwXXXXXXX',
        description: 'Set the view you want to fetch, default is first view. result will filter and sort by view options.',
    }),
    ignoreViewQuery: zod_1.z
        .string()
        .or(zod_1.z.boolean())
        .transform((value) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string' && value.toLowerCase() !== 'false') {
            return true;
        }
        return false;
    })
        .optional()
        .openapi({
        description: "When a viewId is specified, configure this to true will ignore the view's filter, sort, etc",
    }),
    filterByTql: zod_1.z.string().optional().openapi({
        example: "{field} = 'Completed' AND {field} > 5",
        deprecated: true,
    }),
    filter: zod_1.z
        .string()
        .optional()
        .transform((value, ctx) => {
        if (value == null) {
            return value;
        }
        const parsingResult = core_1.filterSchema.safeParse(JSON.parse(value));
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
        description: core_1.FILTER_DESCRIPTION,
    }),
    search: zod_1.z
        .union([
        zod_1.z.tuple([zod_1.z.string()]),
        zod_1.z.tuple([zod_1.z.string(), zod_1.z.string()]),
        zod_1.z.tuple([
            zod_1.z.string(),
            zod_1.z.string(),
            zod_1.z.union([
                zod_1.z.string().transform((val) => {
                    if (val === 'true') {
                        return true;
                    }
                    else if (val === 'false') {
                        return false;
                    }
                    return true;
                }),
                zod_1.z.boolean(),
            ]),
        ]),
    ])
        .optional()
        // because of the https params only be string, so the boolean params should transform
        .openapi({
        default: ['searchValue', 'fieldIdOrName', false],
        description: 'Search for records that match the specified field and value',
    }),
    filterLinkCellCandidate: zod_1.z
        .tuple([zod_1.z.string().startsWith(core_1.IdPrefix.Field), zod_1.z.string().startsWith(core_1.IdPrefix.Record)])
        .or(zod_1.z.string().startsWith(core_1.IdPrefix.Field))
        .optional()
        .openapi({
        example: ['fldXXXXXXX', 'recXXXXXXX'],
        description: 'Filter out the records that can be selected by a given link cell from the relational table. For example, if the specified field is one to many or one to one relationship, recordId for which the field has already been selected will not appear.',
    }),
    filterLinkCellSelected: zod_1.z
        .tuple([zod_1.z.string().startsWith(core_1.IdPrefix.Field), zod_1.z.string().startsWith(core_1.IdPrefix.Record)])
        .or(zod_1.z.string().startsWith(core_1.IdPrefix.Field))
        .optional()
        .openapi({
        example: ['fldXXXXXXX', 'recXXXXXXX'],
        description: 'Filter out selected records based on this link cell from the relational table. Note that viewId, filter, and orderBy will not take effect in this case because selected records has it own order. Ignoring recordId gets all the selected records for the field',
    }),
    selectedRecordIds: zod_1.z.array(zod_1.z.string().startsWith(core_1.IdPrefix.Record)).optional().openapi({
        description: 'Filter selected records by record ids',
    }),
});
const orderByDescription = 'An array of sort objects that specifies how the records should be ordered.';
exports.orderBySchema = core_1.sortItemSchema.array().openapi({
    type: 'array',
    description: orderByDescription,
});
// with orderBy for content related fetch
exports.contentQueryBaseSchema = exports.queryBaseSchema.extend({
    orderBy: zod_1.z
        .string()
        .optional()
        .transform((value, ctx) => {
        if (value == null) {
            return value;
        }
        const parsingResult = exports.orderBySchema.safeParse(JSON.parse(value));
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
        description: orderByDescription,
    }),
    groupBy: zod_1.z
        .string()
        .optional()
        .transform((value, ctx) => {
        if (value == null) {
            return value;
        }
        const parsingResult = core_1.groupSchema.safeParse(JSON.parse(value));
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
        description: 'An array of group objects that specifies how the records should be grouped.',
    }),
    collapsedGroupIds: zod_1.z
        .string()
        .optional()
        .transform((value, ctx) => {
        if (value == null) {
            return value;
        }
        const parsingResult = zod_1.z.array(zod_1.z.string()).safeParse(JSON.parse(value));
        if (!parsingResult.success) {
            parsingResult.error.issues.forEach((issue) => {
                ctx.addIssue(issue);
            });
            return zod_1.z.NEVER;
        }
        return parsingResult.data;
    })
        .openapi({
        description: 'An array of group ids that specifies which groups are collapsed',
    }),
    queryId: zod_1.z.string().optional().openapi({
        example: 'qry_xxxxxxxx',
        description: 'When provided, other query parameters will be merged with the saved ones.',
    }),
});
exports.getRecordsRoSchema = get_1.getRecordQuerySchema.merge(exports.contentQueryBaseSchema).extend({
    take: zod_1.z
        .string()
        .or(zod_1.z.number())
        .transform(Number)
        .pipe(zod_1.z
        .number()
        .min(1, 'You should at least take 1 record')
        .max(maxPageSize, `Can't take more than ${maxPageSize} records, please reduce take count`))
        .default(defaultPageSize)
        .optional()
        .openapi({
        example: defaultPageSize,
        description: `The record count you want to take, maximum is ${maxPageSize}`,
    }),
    skip: zod_1.z
        .string()
        .or(zod_1.z.number())
        .transform(Number)
        .pipe(zod_1.z.number().min(0, 'You can not skip a negative count of records'))
        .default(0)
        .optional()
        .openapi({
        example: 0,
        description: 'The records count you want to skip',
    }),
});
exports.recordsSchema = core_1.recordSchema.array().openapi({
    example: [
        {
            id: 'recXXXXXXX',
            fields: {
                'single line text': 'text value',
            },
        },
    ],
    description: 'Array of record objects ',
});
exports.recordsVoSchema = zod_1.z.object({
    records: core_1.recordSchema.array().openapi({
        example: [
            {
                id: 'recXXXXXXX',
                fields: {
                    'single line text': 'text value',
                },
            },
        ],
        description: 'Array of record objects ',
    }),
    extra: zod_1.z
        .object({
        groupPoints: type_1.groupPointsVoSchema.optional().openapi({
            description: 'Group points for the view',
        }),
        allGroupHeaderRefs: zod_1.z.array(type_1.groupHeaderRefSchema).optional().openapi({
            description: 'All group header refs for the view, including collapsed group headers',
        }),
        searchHitIndex: zod_1.z
            .array(zod_1.z.object({
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }))
            .nullable()
            .optional()
            .openapi({
            description: 'The index of the records that match the search, highlight the records',
        }),
    })
        .optional(),
});
exports.GET_RECORDS_URL = '/table/{tableId}/record';
exports.GetRecordsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORDS_URL,
    summary: 'List records',
    description: 'Retrieve a list of records with support for filtering, sorting, grouping, and pagination. The response includes record data and optional group information.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.getRecordsRoSchema,
    },
    responses: {
        200: {
            description: 'List of records',
            content: {
                'application/json': {
                    schema: exports.recordsVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function getRecords(tableId, query) {
    // Add serialization for complex query parameters
    const serializedQuery = {
        ...query,
        filter: query?.filter ? JSON.stringify(query.filter) : undefined,
        orderBy: query?.orderBy ? JSON.stringify(query.orderBy) : undefined,
        groupBy: query?.groupBy ? JSON.stringify(query.groupBy) : undefined,
        collapsedGroupIds: query?.collapsedGroupIds
            ? JSON.stringify(query.collapsedGroupIds)
            : undefined,
    };
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORDS_URL, { tableId }), {
        params: serializedQuery,
    });
}
exports.getRecords = getRecords;
