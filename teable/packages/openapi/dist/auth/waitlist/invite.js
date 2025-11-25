"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteWaitlist = exports.InviteWaitlistRoute = exports.inviteWaitlistSchemaVo = exports.inviteWaitlistRoSchema = exports.INVITE_WAITLIST = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.INVITE_WAITLIST = '/auth/invite-waitlist';
exports.inviteWaitlistRoSchema = zod_1.z.object({
    list: zod_1.z.array(zod_1.z.string().email()),
});
exports.inviteWaitlistSchemaVo = zod_1.z.array(zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string(),
    times: zod_1.z.number(),
}));
exports.InviteWaitlistRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.INVITE_WAITLIST,
    description: 'Invite waitlist',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.inviteWaitlistRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Invite waitlist successfully',
            content: {
                'application/json': {
                    schema: exports.inviteWaitlistSchemaVo,
                },
            },
        },
    },
    tags: ['auth', 'waitlist'],
});
const inviteWaitlist = async (body) => {
    return axios_1.axios.post(exports.INVITE_WAITLIST, body);
};
exports.inviteWaitlist = inviteWaitlist;
