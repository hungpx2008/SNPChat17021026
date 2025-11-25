"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnterpriseLicenseStatus = exports.GetEnterpriseLicenseStatusRoute = exports.GET_ENTERPRISE_LICENSE_STATUS = exports.enterpriseLicenseStatusVoSchema = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.enterpriseLicenseStatusVoSchema = zod_1.z.object({
    expiredTime: zod_1.z.string().optional().nullable(),
});
exports.GET_ENTERPRISE_LICENSE_STATUS = '/admin/enterprise-license/status';
exports.GetEnterpriseLicenseStatusRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_ENTERPRISE_LICENSE_STATUS,
    description: 'Get enterprise license expiration status',
    request: {},
    responses: {
        200: {
            description: 'Returns enterprise license expiration status.',
            content: {
                'application/json': {
                    schema: exports.enterpriseLicenseStatusVoSchema,
                },
            },
        },
    },
    tags: ['admin'],
});
const getEnterpriseLicenseStatus = async () => {
    return axios_1.axios.get(exports.GET_ENTERPRISE_LICENSE_STATUS);
};
exports.getEnterpriseLicenseStatus = getEnterpriseLicenseStatus;
