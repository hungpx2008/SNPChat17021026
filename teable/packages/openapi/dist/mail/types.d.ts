import { z } from 'zod';
export declare enum MailTransporterType {
    Default = "default",
    Test = "test",
    Notify = "notify",
    Automation = "automation"
}
export declare enum MailType {
    Automation = "automation",
    Notify = "notify",
    System = "system",
    VerifyCode = "verifyCode",
    ResetPassword = "resetPassword",
    Invite = "invite",
    Common = "common",
    ExportBase = "exportBase",
    CollaboratorCellTag = "collaboratorCellTag",
    CollaboratorMultiRowTag = "collaboratorMultiRowTag",
    NotifyMerge = "notifyMerge",
    WaitlistInvite = "waitlistInvite",
    AutomationSendEmailAction = "automationSendEmailAction"
}
export declare const mailTransportConfigSchema: z.ZodObject<{
    senderName: z.ZodOptional<z.ZodString>;
    sender: z.ZodString;
    host: z.ZodString;
    port: z.ZodNumber;
    secure: z.ZodOptional<z.ZodBoolean>;
    auth: z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        user: string;
        pass: string;
    }, {
        user: string;
        pass: string;
    }>;
}, "strip", z.ZodTypeAny, {
    auth: {
        user: string;
        pass: string;
    };
    host: string;
    sender: string;
    port: number;
    senderName?: string | undefined;
    secure?: boolean | undefined;
}, {
    auth: {
        user: string;
        pass: string;
    };
    host: string;
    sender: string;
    port: number;
    senderName?: string | undefined;
    secure?: boolean | undefined;
}>;
export type IMailTransportConfig = z.infer<typeof mailTransportConfigSchema>;
