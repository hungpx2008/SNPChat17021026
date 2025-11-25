"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFieldIdsFromFilter = exports.mergeFilter = exports.mergeWithDefaultFilter = exports.filterStringSchema = exports.filterRoSchema = exports.filterSchema = exports.FILTER_DESCRIPTION = exports.nestedFilterItemSchema = exports.baseFilterSetSchema = void 0;
const zod_1 = require("zod");
const conjunction_1 = require("./conjunction");
const filter_item_1 = require("./filter-item");
exports.baseFilterSetSchema = zod_1.z.object({
    conjunction: conjunction_1.conjunctionSchema,
});
exports.nestedFilterItemSchema = exports.baseFilterSetSchema.extend({
    filterSet: zod_1.z.lazy(() => zod_1.z.union([filter_item_1.filterItemSchema, exports.nestedFilterItemSchema]).array()),
});
exports.FILTER_DESCRIPTION = 'A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters.';
exports.filterSchema = exports.nestedFilterItemSchema.nullable().openapi({
    type: 'object',
    description: exports.FILTER_DESCRIPTION,
});
exports.filterRoSchema = zod_1.z.object({
    filter: exports.filterSchema,
});
exports.filterStringSchema = zod_1.z.string().transform((val, ctx) => {
    let jsonValue;
    try {
        jsonValue = JSON.parse(val);
    }
    catch {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Invalid JSON string',
        });
        return zod_1.z.NEVER;
    }
    return exports.filterSchema.parse(jsonValue);
});
function mergeWithDefaultFilter(defaultViewFilter, queryFilter) {
    if (!defaultViewFilter && !queryFilter) {
        return undefined;
    }
    const parseFilter = exports.filterStringSchema.safeParse(defaultViewFilter);
    const viewFilter = parseFilter.success ? parseFilter.data : undefined;
    let mergeFilter = viewFilter;
    if (queryFilter) {
        if (viewFilter) {
            mergeFilter = {
                filterSet: [{ filterSet: [viewFilter, queryFilter], conjunction: 'and' }],
                conjunction: 'and',
            };
        }
        else {
            mergeFilter = queryFilter;
        }
    }
    return mergeFilter;
}
exports.mergeWithDefaultFilter = mergeWithDefaultFilter;
const mergeFilter = (filter1, filter2, conjunction = conjunction_1.and.value) => {
    const parsedFilter1 = exports.filterSchema.safeParse(filter1);
    const finalFilter1 = parsedFilter1.success ? parsedFilter1.data : undefined;
    const parsedFilter2 = exports.filterSchema.safeParse(filter2);
    const finalFilter2 = parsedFilter2.success ? parsedFilter2.data : undefined;
    if (!finalFilter1 && !finalFilter2)
        return;
    if (!finalFilter1)
        return finalFilter2;
    if (!finalFilter2)
        return finalFilter1;
    return {
        filterSet: [{ filterSet: [finalFilter1, finalFilter2], conjunction }],
        conjunction,
    };
};
exports.mergeFilter = mergeFilter;
const extractFieldIdsFromFilter = (filter, includeValueFieldIds = false) => {
    if (!filter)
        return [];
    const fieldIds = [];
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const traverse = (filterItem) => {
        if (filterItem && 'fieldId' in filterItem) {
            fieldIds.push(filterItem.fieldId);
            if (includeValueFieldIds) {
                const value = filterItem.value;
                if ((0, filter_item_1.isFieldReferenceValue)(value)) {
                    fieldIds.push(value.fieldId);
                }
                else if (Array.isArray(value)) {
                    for (const entry of value) {
                        if ((0, filter_item_1.isFieldReferenceValue)(entry)) {
                            fieldIds.push(entry.fieldId);
                        }
                    }
                }
            }
        }
        else if (filterItem && 'filterSet' in filterItem) {
            filterItem.filterSet.forEach((item) => traverse(item));
        }
    };
    traverse(filter);
    return [...new Set(fieldIds)];
};
exports.extractFieldIdsFromFilter = extractFieldIdsFromFilter;
