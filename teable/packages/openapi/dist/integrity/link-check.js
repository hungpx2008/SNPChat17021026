"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBaseIntegrity = exports.IntegrityCheckRoute = exports.integrityCheckVoSchema = exports.linkFieldCheckItemSchema = exports.integrityIssueSchema = exports.IntegrityIssueType = exports.CHECK_BASE_INTEGRITY = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CHECK_BASE_INTEGRITY = '/integrity/base/{baseId}/link-check';
// Define the issue types enum
var IntegrityIssueType;
(function (IntegrityIssueType) {
    IntegrityIssueType["ForeignTableNotFound"] = "ForeignTableNotFound";
    IntegrityIssueType["ForeignKeyNotFound"] = "ForeignKeyNotFound";
    IntegrityIssueType["SelfKeyNotFound"] = "SelfKeyNotFound";
    IntegrityIssueType["SymmetricFieldNotFound"] = "SymmetricFieldNotFound";
    IntegrityIssueType["MissingRecordReference"] = "MissingRecordReference";
    IntegrityIssueType["InvalidLinkReference"] = "InvalidLinkReference";
    IntegrityIssueType["ForeignKeyHostTableNotFound"] = "ForeignKeyHostTableNotFound";
    IntegrityIssueType["ReferenceFieldNotFound"] = "ReferenceFieldNotFound";
    IntegrityIssueType["UniqueIndexNotFound"] = "UniqueIndexNotFound";
    IntegrityIssueType["EmptyString"] = "EmptyString";
})(IntegrityIssueType || (exports.IntegrityIssueType = IntegrityIssueType = {}));
// Define the schema for a single issue
exports.integrityIssueSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(IntegrityIssueType),
    message: zod_1.z.string(),
    fieldId: zod_1.z.string(),
    tableId: zod_1.z.string().optional(),
});
// Define the schema for a link field check item
exports.linkFieldCheckItemSchema = zod_1.z.object({
    baseId: zod_1.z
        .string()
        .optional()
        .openapi({ description: 'The base id of the link field with is cross-base' }),
    baseName: zod_1.z.string().optional(),
    tableId: zod_1.z.string().optional(),
    tableName: zod_1.z.string().optional(),
    issues: zod_1.z.array(exports.integrityIssueSchema),
});
// Define the response schema
exports.integrityCheckVoSchema = zod_1.z.object({
    hasIssues: zod_1.z.boolean(),
    linkFieldIssues: zod_1.z.array(exports.linkFieldCheckItemSchema),
});
exports.IntegrityCheckRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.CHECK_BASE_INTEGRITY,
    description: 'Check integrity of link fields in a base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns integrity check results for the base',
            content: {
                'application/json': {
                    schema: exports.integrityCheckVoSchema,
                },
            },
        },
    },
    tags: ['integrity'],
});
const checkBaseIntegrity = async (baseId, tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.CHECK_BASE_INTEGRITY, {
        baseId,
    }), {
        params: {
            tableId,
        },
    });
};
exports.checkBaseIntegrity = checkBaseIntegrity;
