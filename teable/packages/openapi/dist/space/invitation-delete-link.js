"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpaceInvitationLink = exports.DeleteSpaceInvitationLinkRoute = exports.DELETE_SPACE_INVITATION_LINK = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_SPACE_INVITATION_LINK = '/space/{spaceId}/invitation/link/{invitationId}';
exports.DeleteSpaceInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_SPACE_INVITATION_LINK,
    description: 'Delete a invitation link to your',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
            invitationId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['space'],
});
const deleteSpaceInvitationLink = (params) => {
    const { spaceId, invitationId } = params;
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_SPACE_INVITATION_LINK, { spaceId, invitationId }));
};
exports.deleteSpaceInvitationLink = deleteSpaceInvitationLink;
