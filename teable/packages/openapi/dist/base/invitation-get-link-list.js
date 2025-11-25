"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBaseInvitationLink = exports.ListBaseInvitationLinkRoute = exports.listBaseInvitationLinkVoSchema = exports.itemBaseInvitationLinkVoSchema = exports.LIST_BASE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const invitation_get_link_list_1 = require("../space/invitation-get-link-list");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.LIST_BASE_INVITATION_LINK = '/base/{baseId}/invitation/link';
exports.itemBaseInvitationLinkVoSchema = invitation_get_link_list_1.itemSpaceInvitationLinkVoSchema
    .omit({
    role: true,
})
    .extend({
    role: core_1.baseRolesSchema,
});
exports.listBaseInvitationLinkVoSchema = zod_1.z.array(exports.itemBaseInvitationLinkVoSchema);
exports.ListBaseInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.LIST_BASE_INVITATION_LINK,
    description: 'List a invitation link to your',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successful response, return invitation information list.',
            content: {
                'application/json': {
                    schema: exports.listBaseInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const listBaseInvitationLink = (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.LIST_BASE_INVITATION_LINK, { baseId }));
};
exports.listBaseInvitationLink = listBaseInvitationLink;
