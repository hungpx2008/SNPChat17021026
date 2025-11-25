import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { BillingProductLevel } from '../billing';
export declare enum UsageFeature {
    NumRows = "numRows",
    AttachmentSize = "attachmentSize",
    NumDatabaseConnections = "numDatabaseConnections",
    NumCollaborators = "numCollaborators"
}
export declare const usageFeatureSchema: z.ZodObject<{
    numRows: z.ZodNumber;
    attachmentSize: z.ZodNumber;
    numDatabaseConnections: z.ZodNumber;
    numCollaborators: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    numRows: number;
    attachmentSize: number;
    numDatabaseConnections: number;
    numCollaborators: number;
}, {
    numRows: number;
    attachmentSize: number;
    numDatabaseConnections: number;
    numCollaborators: number;
}>;
export declare enum UsageFeatureLimit {
    MaxRows = "maxRows",
    MaxSizeAttachments = "maxSizeAttachments",
    MaxNumDatabaseConnections = "maxNumDatabaseConnections",
    MaxRevisionHistoryDays = "maxRevisionHistoryDays",
    MaxAutomationHistoryDays = "maxAutomationHistoryDays",
    AutomationEnable = "automationEnable",
    AuditLogEnable = "auditLogEnable",
    AdminPanelEnable = "adminPanelEnable",
    RowColoringEnable = "rowColoringEnable",
    ButtonFieldEnable = "buttonFieldEnable",
    FieldAIEnable = "fieldAIEnable",
    UserGroupEnable = "userGroupEnable",
    AdvancedExtensionsEnable = "advancedExtensionsEnable",
    AdvancedPermissionsEnable = "advancedPermissionsEnable",
    PasswordRestrictedSharesEnable = "passwordRestrictedSharesEnable",
    AuthenticationEnable = "authenticationEnable",
    DomainVerificationEnable = "domainVerificationEnable",
    OrganizationEnable = "organizationEnable",
    APIRateLimit = "apiRateLimit",
    ChatAIEnable = "chatAIEnable",
    AppEnable = "appEnable",
    CustomDomainEnable = "customDomainEnable"
}
export declare const usageFeatureLimitSchema: z.ZodObject<{
    maxRows: z.ZodNumber;
    maxSizeAttachments: z.ZodNumber;
    maxNumDatabaseConnections: z.ZodNumber;
    maxRevisionHistoryDays: z.ZodNumber;
    maxAutomationHistoryDays: z.ZodNumber;
    automationEnable: z.ZodBoolean;
    auditLogEnable: z.ZodBoolean;
    adminPanelEnable: z.ZodBoolean;
    rowColoringEnable: z.ZodBoolean;
    buttonFieldEnable: z.ZodBoolean;
    fieldAIEnable: z.ZodBoolean;
    userGroupEnable: z.ZodBoolean;
    advancedExtensionsEnable: z.ZodBoolean;
    advancedPermissionsEnable: z.ZodBoolean;
    passwordRestrictedSharesEnable: z.ZodBoolean;
    authenticationEnable: z.ZodBoolean;
    domainVerificationEnable: z.ZodBoolean;
    organizationEnable: z.ZodBoolean;
    apiRateLimit: z.ZodNumber;
    chatAIEnable: z.ZodBoolean;
    appEnable: z.ZodBoolean;
    customDomainEnable: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    maxRows: number;
    maxSizeAttachments: number;
    maxNumDatabaseConnections: number;
    maxRevisionHistoryDays: number;
    maxAutomationHistoryDays: number;
    automationEnable: boolean;
    auditLogEnable: boolean;
    adminPanelEnable: boolean;
    rowColoringEnable: boolean;
    buttonFieldEnable: boolean;
    fieldAIEnable: boolean;
    userGroupEnable: boolean;
    advancedExtensionsEnable: boolean;
    advancedPermissionsEnable: boolean;
    passwordRestrictedSharesEnable: boolean;
    authenticationEnable: boolean;
    domainVerificationEnable: boolean;
    organizationEnable: boolean;
    apiRateLimit: number;
    chatAIEnable: boolean;
    appEnable: boolean;
    customDomainEnable: boolean;
}, {
    maxRows: number;
    maxSizeAttachments: number;
    maxNumDatabaseConnections: number;
    maxRevisionHistoryDays: number;
    maxAutomationHistoryDays: number;
    automationEnable: boolean;
    auditLogEnable: boolean;
    adminPanelEnable: boolean;
    rowColoringEnable: boolean;
    buttonFieldEnable: boolean;
    fieldAIEnable: boolean;
    userGroupEnable: boolean;
    advancedExtensionsEnable: boolean;
    advancedPermissionsEnable: boolean;
    passwordRestrictedSharesEnable: boolean;
    authenticationEnable: boolean;
    domainVerificationEnable: boolean;
    organizationEnable: boolean;
    apiRateLimit: number;
    chatAIEnable: boolean;
    appEnable: boolean;
    customDomainEnable: boolean;
}>;
export declare const usageVoSchema: z.ZodObject<{
    level: z.ZodNativeEnum<typeof BillingProductLevel>;
    limit: z.ZodObject<{
        maxRows: z.ZodNumber;
        maxSizeAttachments: z.ZodNumber;
        maxNumDatabaseConnections: z.ZodNumber;
        maxRevisionHistoryDays: z.ZodNumber;
        maxAutomationHistoryDays: z.ZodNumber;
        automationEnable: z.ZodBoolean;
        auditLogEnable: z.ZodBoolean;
        adminPanelEnable: z.ZodBoolean;
        rowColoringEnable: z.ZodBoolean;
        buttonFieldEnable: z.ZodBoolean;
        fieldAIEnable: z.ZodBoolean;
        userGroupEnable: z.ZodBoolean;
        advancedExtensionsEnable: z.ZodBoolean;
        advancedPermissionsEnable: z.ZodBoolean;
        passwordRestrictedSharesEnable: z.ZodBoolean;
        authenticationEnable: z.ZodBoolean;
        domainVerificationEnable: z.ZodBoolean;
        organizationEnable: z.ZodBoolean;
        apiRateLimit: z.ZodNumber;
        chatAIEnable: z.ZodBoolean;
        appEnable: z.ZodBoolean;
        customDomainEnable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        maxRows: number;
        maxSizeAttachments: number;
        maxNumDatabaseConnections: number;
        maxRevisionHistoryDays: number;
        maxAutomationHistoryDays: number;
        automationEnable: boolean;
        auditLogEnable: boolean;
        adminPanelEnable: boolean;
        rowColoringEnable: boolean;
        buttonFieldEnable: boolean;
        fieldAIEnable: boolean;
        userGroupEnable: boolean;
        advancedExtensionsEnable: boolean;
        advancedPermissionsEnable: boolean;
        passwordRestrictedSharesEnable: boolean;
        authenticationEnable: boolean;
        domainVerificationEnable: boolean;
        organizationEnable: boolean;
        apiRateLimit: number;
        chatAIEnable: boolean;
        appEnable: boolean;
        customDomainEnable: boolean;
    }, {
        maxRows: number;
        maxSizeAttachments: number;
        maxNumDatabaseConnections: number;
        maxRevisionHistoryDays: number;
        maxAutomationHistoryDays: number;
        automationEnable: boolean;
        auditLogEnable: boolean;
        adminPanelEnable: boolean;
        rowColoringEnable: boolean;
        buttonFieldEnable: boolean;
        fieldAIEnable: boolean;
        userGroupEnable: boolean;
        advancedExtensionsEnable: boolean;
        advancedPermissionsEnable: boolean;
        passwordRestrictedSharesEnable: boolean;
        authenticationEnable: boolean;
        domainVerificationEnable: boolean;
        organizationEnable: boolean;
        apiRateLimit: number;
        chatAIEnable: boolean;
        appEnable: boolean;
        customDomainEnable: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    limit: {
        maxRows: number;
        maxSizeAttachments: number;
        maxNumDatabaseConnections: number;
        maxRevisionHistoryDays: number;
        maxAutomationHistoryDays: number;
        automationEnable: boolean;
        auditLogEnable: boolean;
        adminPanelEnable: boolean;
        rowColoringEnable: boolean;
        buttonFieldEnable: boolean;
        fieldAIEnable: boolean;
        userGroupEnable: boolean;
        advancedExtensionsEnable: boolean;
        advancedPermissionsEnable: boolean;
        passwordRestrictedSharesEnable: boolean;
        authenticationEnable: boolean;
        domainVerificationEnable: boolean;
        organizationEnable: boolean;
        apiRateLimit: number;
        chatAIEnable: boolean;
        appEnable: boolean;
        customDomainEnable: boolean;
    };
    level: BillingProductLevel;
}, {
    limit: {
        maxRows: number;
        maxSizeAttachments: number;
        maxNumDatabaseConnections: number;
        maxRevisionHistoryDays: number;
        maxAutomationHistoryDays: number;
        automationEnable: boolean;
        auditLogEnable: boolean;
        adminPanelEnable: boolean;
        rowColoringEnable: boolean;
        buttonFieldEnable: boolean;
        fieldAIEnable: boolean;
        userGroupEnable: boolean;
        advancedExtensionsEnable: boolean;
        advancedPermissionsEnable: boolean;
        passwordRestrictedSharesEnable: boolean;
        authenticationEnable: boolean;
        domainVerificationEnable: boolean;
        organizationEnable: boolean;
        apiRateLimit: number;
        chatAIEnable: boolean;
        appEnable: boolean;
        customDomainEnable: boolean;
    };
    level: BillingProductLevel;
}>;
export type IUsageVo = z.infer<typeof usageVoSchema>;
export declare const GET_SPACE_USAGE = "/space/{spaceId}/usage";
export declare const GetSpaceUsageRoute: RouteConfig;
export declare const getSpaceUsage: (spaceId: string) => Promise<import("axios").AxiosResponse<{
    limit: {
        maxRows: number;
        maxSizeAttachments: number;
        maxNumDatabaseConnections: number;
        maxRevisionHistoryDays: number;
        maxAutomationHistoryDays: number;
        automationEnable: boolean;
        auditLogEnable: boolean;
        adminPanelEnable: boolean;
        rowColoringEnable: boolean;
        buttonFieldEnable: boolean;
        fieldAIEnable: boolean;
        userGroupEnable: boolean;
        advancedExtensionsEnable: boolean;
        advancedPermissionsEnable: boolean;
        passwordRestrictedSharesEnable: boolean;
        authenticationEnable: boolean;
        domainVerificationEnable: boolean;
        organizationEnable: boolean;
        apiRateLimit: number;
        chatAIEnable: boolean;
        appEnable: boolean;
        customDomainEnable: boolean;
    };
    level: BillingProductLevel;
}, any>>;
