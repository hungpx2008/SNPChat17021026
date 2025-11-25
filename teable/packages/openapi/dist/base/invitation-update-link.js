"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBaseInvitationLink = exports.UpdateBaseInvitationLinkRoute = exports.updateBaseInvitationLinkVoSchema = exports.updateBaseInvitationLinkRoSchema = exports.UPDATE_BASE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_BASE_INVITATION_LINK = '/base/{baseId}/invitation/link/{invitationId}';
exports.updateBaseInvitationLinkRoSchema = zod_1.z.object({
    role: core_1.baseRolesSchema,
});
exports.updateBaseInvitationLinkVoSchema = zod_1.z.object({
    invitationId: zod_1.z.string(),
    role: core_1.baseRolesSchema,
});
exports.UpdateBaseInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_BASE_INVITATION_LINK,
    description: 'Update a invitation link to your',
    request: {
        params: zod_1.z.object({
            invitationId: zod_1.z.string(),
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateBaseInvitationLinkRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response.',
            content: {
                'application/json': {
                    schema: exports.updateBaseInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const updateBaseInvitationLink = (params) => {
    const { baseId, invitationId, updateBaseInvitationLinkRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_BASE_INVITATION_LINK, { baseId, invitationId }), updateBaseInvitationLinkRo);
};
exports.updateBaseInvitationLink = updateBaseInvitationLink;
