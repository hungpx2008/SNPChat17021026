"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailBaseInvitation = exports.EmailBaseInvitationRoute = exports.emailBaseInvitationVoSchema = exports.emailBaseInvitationRoSchema = exports.EMAIL_BASE_INVITATION = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.EMAIL_BASE_INVITATION = '/base/{baseId}/invitation/email';
exports.emailBaseInvitationRoSchema = zod_1.z.object({
    emails: zod_1.z.array(zod_1.z.string().email()).min(1),
    role: core_1.baseRolesSchema,
});
exports.emailBaseInvitationVoSchema = zod_1.z.record(zod_1.z.object({
    invitationId: zod_1.z.string(),
}));
exports.EmailBaseInvitationRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.EMAIL_BASE_INVITATION,
    description: 'Send invitations by e-mail',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.emailBaseInvitationRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful response, return invitation information.',
            content: {
                'application/json': {
                    schema: exports.emailBaseInvitationVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const emailBaseInvitation = (params) => {
    const { baseId, emailBaseInvitationRo } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.EMAIL_BASE_INVITATION, { baseId }), emailBaseInvitationRo);
};
exports.emailBaseInvitation = emailBaseInvitation;
