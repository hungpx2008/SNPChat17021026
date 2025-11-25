"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genWaitlistInviteCode = exports.WaitlistInviteCodeRoute = exports.waitlistInviteCodeSchemaVo = exports.waitlistInviteCodeRoSchema = exports.WAITLIST_INVITE_CODE = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.WAITLIST_INVITE_CODE = '/auth/waitlist-invite-code';
exports.waitlistInviteCodeRoSchema = zod_1.z.object({
    count: zod_1.z.number().int().openapi({
        description: 'The number of invite codes to generate',
        example: 10,
    }),
    times: zod_1.z.number().int().openapi({
        description: 'The number of invite codes to use',
        example: 10,
    }),
});
exports.waitlistInviteCodeSchemaVo = zod_1.z.array(zod_1.z.object({
    code: zod_1.z.string(),
    times: zod_1.z.number().int(),
}));
exports.WaitlistInviteCodeRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.WAITLIST_INVITE_CODE,
    description: 'Gen waitlist invite code',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.waitlistInviteCodeRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Gen waitlist invite code successfully',
            content: {
                'application/json': {
                    schema: exports.waitlistInviteCodeSchemaVo,
                },
            },
        },
    },
    tags: ['auth', 'waitlist'],
});
const genWaitlistInviteCode = async (body) => {
    return axios_1.axios.post(exports.WAITLIST_INVITE_CODE, body);
};
exports.genWaitlistInviteCode = genWaitlistInviteCode;
