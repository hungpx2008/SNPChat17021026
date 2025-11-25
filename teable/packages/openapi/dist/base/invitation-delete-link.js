"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBaseInvitationLink = exports.DeleteBaseInvitationLinkRoute = exports.DELETE_BASE_INVITATION_LINK = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_BASE_INVITATION_LINK = '/base/{baseId}/invitation/link/{invitationId}';
exports.DeleteBaseInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_BASE_INVITATION_LINK,
    description: 'Delete a invitation link to your',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            invitationId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['base'],
});
const deleteBaseInvitationLink = (params) => {
    const { baseId, invitationId } = params;
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_BASE_INVITATION_LINK, { baseId, invitationId }));
};
exports.deleteBaseInvitationLink = deleteBaseInvitationLink;
