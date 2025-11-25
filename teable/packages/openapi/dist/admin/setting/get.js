"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetting = exports.GetSettingRoute = exports.GET_SETTING = exports.settingVoSchema = void 0;
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const mail_1 = require("../../mail");
const utils_1 = require("../../utils");
const update_1 = require("./update");
exports.settingVoSchema = zod_1.z.object({
    instanceId: zod_1.z.string(),
    brandName: zod_1.z.string().nullable().optional(),
    brandLogo: zod_1.z.string().nullable().optional(),
    disallowSignUp: zod_1.z.boolean().nullable().optional(),
    disallowSpaceCreation: zod_1.z.boolean().nullable().optional(),
    disallowSpaceInvitation: zod_1.z.boolean().nullable().optional(),
    enableEmailVerification: zod_1.z.boolean().nullable().optional(),
    enableWaitlist: zod_1.z.boolean().nullable().optional(),
    aiConfig: update_1.aiConfigVoSchema.nullable().optional(),
    notifyMailTransportConfig: mail_1.mailTransportConfigSchema.nullable().optional(),
    automationMailTransportConfig: mail_1.mailTransportConfigSchema.nullable().optional(),
    appConfig: update_1.appConfigSchema.nullable().optional(),
    webSearchConfig: update_1.webSearchConfigSchema.nullable().optional(),
    createdTime: zod_1.z.string().optional(),
});
exports.GET_SETTING = '/admin/setting';
exports.GetSettingRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SETTING,
    description: 'Get the instance settings',
    request: {},
    responses: {
        200: {
            description: 'Returns the instance settings.',
            content: {
                'application/json': {
                    schema: exports.settingVoSchema,
                },
            },
        },
    },
    tags: ['admin'],
});
const getSetting = async () => {
    return axios_1.axios.get(exports.GET_SETTING);
};
exports.getSetting = getSetting;
