"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransportConfigSchema = exports.MailType = exports.MailTransporterType = void 0;
const zod_1 = require("zod");
var MailTransporterType;
(function (MailTransporterType) {
    MailTransporterType["Default"] = "default";
    MailTransporterType["Test"] = "test";
    MailTransporterType["Notify"] = "notify";
    MailTransporterType["Automation"] = "automation";
})(MailTransporterType || (exports.MailTransporterType = MailTransporterType = {}));
var MailType;
(function (MailType) {
    MailType["Automation"] = "automation";
    MailType["Notify"] = "notify";
    MailType["System"] = "system";
    MailType["VerifyCode"] = "verifyCode";
    MailType["ResetPassword"] = "resetPassword";
    MailType["Invite"] = "invite";
    MailType["Common"] = "common";
    MailType["ExportBase"] = "exportBase";
    MailType["CollaboratorCellTag"] = "collaboratorCellTag";
    MailType["CollaboratorMultiRowTag"] = "collaboratorMultiRowTag";
    MailType["NotifyMerge"] = "notifyMerge";
    MailType["WaitlistInvite"] = "waitlistInvite";
    MailType["AutomationSendEmailAction"] = "automationSendEmailAction";
})(MailType || (exports.MailType = MailType = {}));
exports.mailTransportConfigSchema = zod_1.z.object({
    senderName: zod_1.z.string().optional(),
    sender: zod_1.z.string(),
    host: zod_1.z.string(),
    port: zod_1.z.number(),
    secure: zod_1.z.boolean().optional(),
    auth: zod_1.z.object({
        user: zod_1.z.string(),
        pass: zod_1.z.string(),
    }),
});
