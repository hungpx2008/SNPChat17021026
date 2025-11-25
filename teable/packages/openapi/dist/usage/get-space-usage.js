"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceUsage = exports.GetSpaceUsageRoute = exports.GET_SPACE_USAGE = exports.usageVoSchema = exports.usageFeatureLimitSchema = exports.UsageFeatureLimit = exports.usageFeatureSchema = exports.UsageFeature = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const billing_1 = require("../billing");
const utils_1 = require("../utils");
var UsageFeature;
(function (UsageFeature) {
    UsageFeature["NumRows"] = "numRows";
    UsageFeature["AttachmentSize"] = "attachmentSize";
    UsageFeature["NumDatabaseConnections"] = "numDatabaseConnections";
    UsageFeature["NumCollaborators"] = "numCollaborators";
})(UsageFeature || (exports.UsageFeature = UsageFeature = {}));
exports.usageFeatureSchema = zod_1.z.object({
    [UsageFeature.NumRows]: zod_1.z.number(),
    [UsageFeature.AttachmentSize]: zod_1.z.number(),
    [UsageFeature.NumDatabaseConnections]: zod_1.z.number(),
    [UsageFeature.NumCollaborators]: zod_1.z.number(),
});
var UsageFeatureLimit;
(function (UsageFeatureLimit) {
    UsageFeatureLimit["MaxRows"] = "maxRows";
    UsageFeatureLimit["MaxSizeAttachments"] = "maxSizeAttachments";
    UsageFeatureLimit["MaxNumDatabaseConnections"] = "maxNumDatabaseConnections";
    UsageFeatureLimit["MaxRevisionHistoryDays"] = "maxRevisionHistoryDays";
    UsageFeatureLimit["MaxAutomationHistoryDays"] = "maxAutomationHistoryDays";
    UsageFeatureLimit["AutomationEnable"] = "automationEnable";
    UsageFeatureLimit["AuditLogEnable"] = "auditLogEnable";
    UsageFeatureLimit["AdminPanelEnable"] = "adminPanelEnable";
    UsageFeatureLimit["RowColoringEnable"] = "rowColoringEnable";
    UsageFeatureLimit["ButtonFieldEnable"] = "buttonFieldEnable";
    UsageFeatureLimit["FieldAIEnable"] = "fieldAIEnable";
    UsageFeatureLimit["UserGroupEnable"] = "userGroupEnable";
    UsageFeatureLimit["AdvancedExtensionsEnable"] = "advancedExtensionsEnable";
    UsageFeatureLimit["AdvancedPermissionsEnable"] = "advancedPermissionsEnable";
    UsageFeatureLimit["PasswordRestrictedSharesEnable"] = "passwordRestrictedSharesEnable";
    UsageFeatureLimit["AuthenticationEnable"] = "authenticationEnable";
    UsageFeatureLimit["DomainVerificationEnable"] = "domainVerificationEnable";
    UsageFeatureLimit["OrganizationEnable"] = "organizationEnable";
    UsageFeatureLimit["APIRateLimit"] = "apiRateLimit";
    UsageFeatureLimit["ChatAIEnable"] = "chatAIEnable";
    UsageFeatureLimit["AppEnable"] = "appEnable";
    UsageFeatureLimit["CustomDomainEnable"] = "customDomainEnable";
})(UsageFeatureLimit || (exports.UsageFeatureLimit = UsageFeatureLimit = {}));
exports.usageFeatureLimitSchema = zod_1.z.object({
    [UsageFeatureLimit.MaxRows]: zod_1.z.number(),
    [UsageFeatureLimit.MaxSizeAttachments]: zod_1.z.number(),
    [UsageFeatureLimit.MaxNumDatabaseConnections]: zod_1.z.number(),
    [UsageFeatureLimit.MaxRevisionHistoryDays]: zod_1.z.number(),
    [UsageFeatureLimit.MaxAutomationHistoryDays]: zod_1.z.number(),
    [UsageFeatureLimit.AutomationEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AuditLogEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AdminPanelEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.RowColoringEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.ButtonFieldEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.FieldAIEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.UserGroupEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AdvancedExtensionsEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AdvancedPermissionsEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.PasswordRestrictedSharesEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AuthenticationEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.DomainVerificationEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.OrganizationEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.APIRateLimit]: zod_1.z.number(),
    [UsageFeatureLimit.ChatAIEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.AppEnable]: zod_1.z.boolean(),
    [UsageFeatureLimit.CustomDomainEnable]: zod_1.z.boolean(),
});
exports.usageVoSchema = zod_1.z.object({
    level: zod_1.z.nativeEnum(billing_1.BillingProductLevel),
    limit: exports.usageFeatureLimitSchema,
});
exports.GET_SPACE_USAGE = '/space/{spaceId}/usage';
exports.GetSpaceUsageRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SPACE_USAGE,
    description: 'Get usage information for the space',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns usage information for the space.',
            content: {
                'application/json': {
                    schema: exports.usageVoSchema,
                },
            },
        },
    },
    tags: ['usage'],
});
const getSpaceUsage = async (spaceId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_SPACE_USAGE, { spaceId }));
};
exports.getSpaceUsage = getSpaceUsage;
