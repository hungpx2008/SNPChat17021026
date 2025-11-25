"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpaceInvitationLink = exports.CreateSpaceInvitationLinkRoute = exports.createSpaceInvitationLinkVoSchema = exports.createSpaceInvitationLinkRoSchema = exports.CREATE_SPACE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const invitation_get_link_list_1 = require("./invitation-get-link-list");
exports.CREATE_SPACE_INVITATION_LINK = '/space/{spaceId}/invitation/link';
exports.createSpaceInvitationLinkRoSchema = zod_1.z.object({
    role: core_1.roleSchema,
});
exports.createSpaceInvitationLinkVoSchema = invitation_get_link_list_1.itemSpaceInvitationLinkVoSchema;
exports.CreateSpaceInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_SPACE_INVITATION_LINK,
    description: 'Create a invitation link to your',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.createSpaceInvitationLinkRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful response, return the ID of the invitation link.',
            content: {
                'application/json': {
                    schema: exports.createSpaceInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['space'],
});
const createSpaceInvitationLink = (params) => {
    const { spaceId, createSpaceInvitationLinkRo } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_SPACE_INVITATION_LINK, { spaceId }), createSpaceInvitationLinkRo);
};
exports.createSpaceInvitationLink = createSpaceInvitationLink;
