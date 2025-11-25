"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationMe = exports.getOrganizationMeRoute = exports.organizationVoSchema = exports.GET_ORGANIZATION_ME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_ORGANIZATION_ME = '/organization/me';
exports.organizationVoSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    isAdmin: zod_1.z.boolean(),
})
    .nullable()
    .optional();
exports.getOrganizationMeRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_ORGANIZATION_ME,
    description: 'Get my organization',
    responses: {
        200: {
            description: 'Get my organization successfully',
            content: {
                'application/json': {
                    schema: exports.organizationVoSchema,
                },
            },
        },
    },
    tags: ['organization'],
});
const getOrganizationMe = () => {
    return axios_1.axios.get(exports.GET_ORGANIZATION_ME);
};
exports.getOrganizationMe = getOrganizationMe;
