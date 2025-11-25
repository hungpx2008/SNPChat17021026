"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseQuerySchema = exports.baseQueryNormalSqlQuery = exports.baseQuerySelectSchema = exports.baseQueryAggregationSchema = exports.baseQueryGroupBySchema = exports.baseQueryJoinSchema = exports.baseQueryJoinTypeSchema = exports.BaseQueryJoinType = exports.baseQueryFilter = exports.baseQueryFilterItemExtendSchema = exports.baseQueryFilterItemSchema = exports.baseQueryColumnTypeSchema = exports.BaseQueryColumnType = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("../../zod");
var BaseQueryColumnType;
(function (BaseQueryColumnType) {
    BaseQueryColumnType["Aggregation"] = "aggregation";
    BaseQueryColumnType["Field"] = "field";
})(BaseQueryColumnType || (exports.BaseQueryColumnType = BaseQueryColumnType = {}));
exports.baseQueryColumnTypeSchema = zod_1.z.nativeEnum(BaseQueryColumnType);
exports.baseQueryFilterItemSchema = zod_1.z.object({
    column: zod_1.z.string(),
    type: exports.baseQueryColumnTypeSchema,
    value: core_1.filterValueSchema,
    operator: core_1.operators,
});
exports.baseQueryFilterItemExtendSchema = (0, core_1.refineExtendedFilterOperatorSchema)(exports.baseQueryFilterItemSchema);
exports.baseQueryFilter = core_1.baseFilterSetSchema.extend({
    filterSet: zod_1.z.lazy(() => zod_1.z.union([exports.baseQueryFilterItemExtendSchema, exports.baseQueryFilter]).array()),
});
var BaseQueryJoinType;
(function (BaseQueryJoinType) {
    BaseQueryJoinType["Inner"] = "INNER JOIN";
    BaseQueryJoinType["Left"] = "LEFT JOIN";
    BaseQueryJoinType["Right"] = "RIGHT JOIN";
    BaseQueryJoinType["Full"] = "FULL JOIN";
})(BaseQueryJoinType || (exports.BaseQueryJoinType = BaseQueryJoinType = {}));
exports.baseQueryJoinTypeSchema = zod_1.z.nativeEnum(BaseQueryJoinType);
exports.baseQueryJoinSchema = zod_1.z.object({
    type: exports.baseQueryJoinTypeSchema,
    table: zod_1.z.string(),
    on: zod_1.z.array(zod_1.z.string(), zod_1.z.string()).length(2),
});
const baseQueryOrderBySchema = zod_1.z.array(zod_1.z.object({
    column: zod_1.z.string(),
    type: exports.baseQueryColumnTypeSchema,
    order: core_1.orderSchema,
}));
exports.baseQueryGroupBySchema = zod_1.z.array(zod_1.z.object({
    column: zod_1.z.string(),
    type: exports.baseQueryColumnTypeSchema,
}));
exports.baseQueryAggregationSchema = zod_1.z.array(zod_1.z.object({
    column: zod_1.z.string(),
    type: exports.baseQueryColumnTypeSchema,
    statisticFunc: zod_1.z.nativeEnum(core_1.StatisticsFunc),
}));
exports.baseQuerySelectSchema = zod_1.z.object({
    type: exports.baseQueryColumnTypeSchema,
    column: zod_1.z.string(),
    alias: zod_1.z.string().optional(),
});
exports.baseQueryNormalSqlQuery = zod_1.z.object({
    select: zod_1.z.array(exports.baseQuerySelectSchema).optional(),
    groupBy: exports.baseQueryGroupBySchema.optional(),
    orderBy: baseQueryOrderBySchema.optional(),
    where: exports.baseQueryFilter.optional(),
    join: zod_1.z.array(exports.baseQueryJoinSchema).optional(),
    limit: zod_1.z.number().optional(),
    offset: zod_1.z.number().optional(),
    aggregation: exports.baseQueryAggregationSchema.optional(),
    // distinct: z.array(z.string()).optional(),
});
exports.baseQuerySchema = exports.baseQueryNormalSqlQuery.extend({
    from: zod_1.z.lazy(() => zod_1.z.union([exports.baseQuerySchema, zod_1.z.string()])),
});
