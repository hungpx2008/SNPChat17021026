"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseInvitationLink = exports.CreateBaseInvitationLinkRoute = exports.createBaseInvitationLinkVoSchema = exports.createBaseInvitationLinkRoSchema = exports.CREATE_BASE_INVITATION_LINK = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const invitation_get_link_list_1 = require("./invitation-get-link-list");
exports.CREATE_BASE_INVITATION_LINK = '/base/{baseId}/invitation/link';
exports.createBaseInvitationLinkRoSchema = zod_1.z.object({
    role: core_1.baseRolesSchema,
});
exports.createBaseInvitationLinkVoSchema = invitation_get_link_list_1.itemBaseInvitationLinkVoSchema;
exports.CreateBaseInvitationLinkRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_BASE_INVITATION_LINK,
    description: 'Create a invitation link to your',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.createBaseInvitationLinkRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful response, return the ID of the invitation link.',
            content: {
                'application/json': {
                    schema: exports.createBaseInvitationLinkVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const createBaseInvitationLink = (params) => {
    const { baseId, createBaseInvitationLinkRo } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_BASE_INVITATION_LINK, { baseId }), createBaseInvitationLinkRo);
};
exports.createBaseInvitationLink = createBaseInvitationLink;
