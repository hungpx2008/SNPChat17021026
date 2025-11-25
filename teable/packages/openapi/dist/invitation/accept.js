"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitationLink = exports.AcceptInvitationLinkRoute = exports.acceptInvitationLinkVoSchema = exports.acceptInvitationLinkRoSchema = exports.ACCEPT_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.ACCEPT_INVITATION_LINK = '/invitation/link/accept';
exports.acceptInvitationLinkRoSchema = zod_1.z.object({
    invitationCode: zod_1.z.string(),
    invitationId: zod_1.z.string().startsWith(core_1.IdPrefix.Invitation),
});
exports.acceptInvitationLinkVoSchema = zod_1.z.object({
    spaceId: zod_1.z.string().nullable(),
    baseId: zod_1.z.string().nullable(),
});
exports.AcceptInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.ACCEPT_INVITATION_LINK,
    description: 'Accept invitation link',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.acceptInvitationLinkRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful response, return the spaceId or baseId of the invitation link.',
            content: {
                'application/json': {
                    schema: exports.acceptInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['invitation'],
});
const acceptInvitationLink = (acceptInvitationLinkRo) => {
    return axios_1.axios.post(exports.ACCEPT_INVITATION_LINK, acceptInvitationLinkRo);
};
exports.acceptInvitationLink = acceptInvitationLink;
