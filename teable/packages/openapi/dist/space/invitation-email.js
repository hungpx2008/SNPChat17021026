"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSpaceInvitation = exports.EmailInvitationRoute = exports.emailSpaceInvitationVoSchema = exports.emailSpaceInvitationRoSchema = exports.EMAIL_SPACE_INVITATION = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.EMAIL_SPACE_INVITATION = '/space/{spaceId}/invitation/email';
exports.emailSpaceInvitationRoSchema = zod_1.z.object({
    emails: zod_1.z.array(zod_1.z.string().email()).min(1),
    role: core_1.roleSchema,
});
exports.emailSpaceInvitationVoSchema = zod_1.z.record(zod_1.z.object({
    invitationId: zod_1.z.string(),
}));
exports.EmailInvitationRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.EMAIL_SPACE_INVITATION,
    description: 'Send invitations by e-mail',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.emailSpaceInvitationRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful response, return invitation information.',
            content: {
                'application/json': {
                    schema: exports.emailSpaceInvitationVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const emailSpaceInvitation = (params) => {
    const { spaceId, emailSpaceInvitationRo } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.EMAIL_SPACE_INVITATION, { spaceId }), emailSpaceInvitationRo);
};
exports.emailSpaceInvitation = emailSpaceInvitation;
