"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConditionalLookupOptions = exports.isLinkLookupOptions = exports.lookupOptionsRoSchema = exports.lookupOptionsVoSchema = void 0;
const zod_1 = require("../../zod");
const filter_1 = require("../view/filter");
const sort_1 = require("../view/sort");
const conditional_constants_1 = require("./conditional.constants");
const constant_1 = require("./constant");
const lookupLinkOptionsVoSchema = zod_1.z.object({
    baseId: zod_1.z.string().optional().openapi({
        description: 'the base id of the table that this field is linked to, only required for cross base link',
    }),
    relationship: zod_1.z.nativeEnum(constant_1.Relationship).openapi({
        description: 'describe the relationship from this table to the foreign table',
    }),
    foreignTableId: zod_1.z.string().openapi({
        description: 'the table this field is linked to',
    }),
    lookupFieldId: zod_1.z.string().openapi({
        description: 'the field in the foreign table that will be displayed as the current field',
    }),
    fkHostTableName: zod_1.z.string().openapi({
        description: 'the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed',
    }),
    selfKeyName: zod_1.z.string().openapi({
        description: 'the name of the field that stores the current table primary key',
    }),
    foreignKeyName: zod_1.z.string().openapi({
        description: 'The name of the field that stores the foreign table primary key',
    }),
    filter: filter_1.filterSchema.optional(),
    linkFieldId: zod_1.z.string().openapi({
        description: 'The id of Linked record field to use for lookup',
    }),
});
const lookupLinkOptionsRoSchema = lookupLinkOptionsVoSchema.pick({
    foreignTableId: true,
    lookupFieldId: true,
    linkFieldId: true,
    filter: true,
});
const lookupConditionalOptionsVoSchema = zod_1.z.object({
    baseId: zod_1.z.string().optional().openapi({
        description: 'the base id of the table that this field is linked to, only required for cross base link',
    }),
    foreignTableId: zod_1.z.string().openapi({
        description: 'the table this field is linked to',
    }),
    lookupFieldId: zod_1.z.string().openapi({
        description: 'the field in the foreign table that will be displayed as the current field',
    }),
    filter: filter_1.filterSchema.openapi({
        description: 'Filter to apply when resolving conditional lookup values.',
    }),
    sort: zod_1.z
        .object({
        fieldId: zod_1.z.string().openapi({
            description: 'The field in the foreign table used to order lookup records.',
        }),
        order: zod_1.z
            .nativeEnum(sort_1.SortFunc)
            .openapi({ description: 'Ordering direction to apply to the sorted field.' }),
    })
        .optional()
        .openapi({
        description: 'Optional sort configuration applied before aggregating lookup values.',
    }),
    limit: zod_1.z.number().int().positive().max(conditional_constants_1.CONDITIONAL_QUERY_MAX_LIMIT).optional().openapi({
        description: 'Maximum number of matching records to include in the lookup result.',
    }),
});
const lookupConditionalOptionsRoSchema = lookupConditionalOptionsVoSchema;
exports.lookupOptionsVoSchema = zod_1.z.union([
    lookupLinkOptionsVoSchema.strict(),
    lookupConditionalOptionsVoSchema.strict(),
]);
exports.lookupOptionsRoSchema = zod_1.z.union([
    lookupLinkOptionsRoSchema.strict(),
    lookupConditionalOptionsRoSchema.strict(),
]);
const isLinkLookupOptions = (options) => {
    return Boolean(options && typeof options === 'object' && 'linkFieldId' in options);
};
exports.isLinkLookupOptions = isLinkLookupOptions;
const isConditionalLookupOptions = (options) => {
    return Boolean(options && typeof options === 'object' && !('linkFieldId' in options));
};
exports.isConditionalLookupOptions = isConditionalLookupOptions;
