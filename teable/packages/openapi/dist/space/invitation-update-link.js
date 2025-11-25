"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpaceInvitationLink = exports.UpdateSpaceInvitationLinkRoute = exports.updateSpaceInvitationLinkVoSchema = exports.updateSpaceInvitationLinkRoSchema = exports.UPDATE_SPACE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_SPACE_INVITATION_LINK = '/space/{spaceId}/invitation/link/{invitationId}';
exports.updateSpaceInvitationLinkRoSchema = zod_1.z.object({
    role: core_1.roleSchema,
});
exports.updateSpaceInvitationLinkVoSchema = zod_1.z.object({
    invitationId: zod_1.z.string(),
    role: core_1.roleSchema,
});
exports.UpdateSpaceInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_SPACE_INVITATION_LINK,
    description: 'Update a invitation link to your',
    request: {
        params: zod_1.z.object({
            invitationId: zod_1.z.string(),
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateSpaceInvitationLinkRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response.',
            content: {
                'application/json': {
                    schema: exports.updateSpaceInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const updateSpaceInvitationLink = (params) => {
    const { spaceId, invitationId, updateSpaceInvitationLinkRo } = params;
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_SPACE_INVITATION_LINK, { spaceId, invitationId }), updateSpaceInvitationLinkRo);
};
exports.updateSpaceInvitationLink = updateSpaceInvitationLink;
