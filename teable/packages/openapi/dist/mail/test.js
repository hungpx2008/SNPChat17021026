"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMailTransportConfig = exports.TestMailTransportConfigRoute = exports.TEST_MAIL_TRANSPORT_CONFIG = exports.testMailTransportConfigRoSchema = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.testMailTransportConfigRoSchema = zod_1.z.object({
    to: zod_1.z.string().email(),
    message: zod_1.z.string().optional(),
    transportConfig: types_1.mailTransportConfigSchema,
});
exports.TEST_MAIL_TRANSPORT_CONFIG = '/mail-sender/test-transport-config';
exports.TestMailTransportConfigRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.TEST_MAIL_TRANSPORT_CONFIG,
    description: 'Test mail transporter',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.testMailTransportConfigRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Test mail transporter successfully.',
        },
    },
    tags: ['mail'],
});
const testMailTransportConfig = async (ro) => {
    return await axios_1.axios.post(exports.TEST_MAIL_TRANSPORT_CONFIG, ro);
};
exports.testMailTransportConfig = testMailTransportConfig;
