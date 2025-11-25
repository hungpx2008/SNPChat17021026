"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingMailTransportConfig = exports.SetSettingMailTransportConfigRoute = exports.setSettingMailTransportConfigVoSchema = exports.setSettingMailTransportConfigRoSchema = exports.SET_SETTING_MAIL_TRANSPORT_CONFIG = void 0;
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const mail_1 = require("../../mail");
const utils_1 = require("../../utils");
exports.SET_SETTING_MAIL_TRANSPORT_CONFIG = '/admin/setting/set-mail-transport-config';
const nameSchema = zod_1.z
    .literal('notifyMailTransportConfig')
    .or(zod_1.z.literal('automationMailTransportConfig'));
exports.setSettingMailTransportConfigRoSchema = zod_1.z.object({
    name: nameSchema,
    transportConfig: mail_1.mailTransportConfigSchema,
});
exports.setSettingMailTransportConfigVoSchema = zod_1.z.object({
    name: nameSchema,
    transportConfig: mail_1.mailTransportConfigSchema,
});
exports.SetSettingMailTransportConfigRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.SET_SETTING_MAIL_TRANSPORT_CONFIG,
    description: 'Set mail transporter',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.setSettingMailTransportConfigRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Set mail transporter successfully.',
            content: {
                'application/json': {
                    schema: exports.setSettingMailTransportConfigVoSchema,
                },
            },
        },
    },
    tags: ['admin', 'setting'],
});
const setSettingMailTransportConfig = async (ro) => {
    return await axios_1.axios.put(exports.SET_SETTING_MAIL_TRANSPORT_CONFIG, ro);
};
exports.setSettingMailTransportConfig = setSettingMailTransportConfig;
