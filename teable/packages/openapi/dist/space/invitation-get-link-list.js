"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSpaceInvitationLink = exports.ListSpaceInvitationLinkRoute = exports.listSpaceInvitationLinkVoSchema = exports.itemSpaceInvitationLinkVoSchema = exports.LIST_SPACE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.LIST_SPACE_INVITATION_LINK = '/space/{spaceId}/invitation/link';
exports.itemSpaceInvitationLinkVoSchema = zod_1.z.object({
    invitationId: zod_1.z.string(),
    role: core_1.roleSchema,
    inviteUrl: zod_1.z.string(),
    invitationCode: zod_1.z.string(),
    createdBy: zod_1.z.string(),
    createdTime: zod_1.z.string(),
});
exports.listSpaceInvitationLinkVoSchema = zod_1.z.array(exports.itemSpaceInvitationLinkVoSchema);
exports.ListSpaceInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.LIST_SPACE_INVITATION_LINK,
    description: 'List a invitation link to your',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successful response, return invitation information list.',
            content: {
                'application/json': {
                    schema: exports.listSpaceInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const listSpaceInvitationLink = (spaceId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.LIST_SPACE_INVITATION_LINK, { spaceId }));
};
exports.listSpaceInvitationLink = listSpaceInvitationLink;
