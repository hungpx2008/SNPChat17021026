"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaitlist = exports.GetWaitlistRoute = exports.getWaitlistSchemaVo = exports.GET_WAITLIST = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.GET_WAITLIST = '/auth/waitlist';
exports.getWaitlistSchemaVo = zod_1.z.array(zod_1.z.object({
    email: zod_1.z.string().email(),
    invite: zod_1.z.boolean().nullable(),
    inviteTime: zod_1.z.date().nullable(),
    createdTime: zod_1.z.date(),
}));
exports.GetWaitlistRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_WAITLIST,
    description: 'Get waitlist',
    request: {},
    responses: {
        200: {
            description: 'Get waitlist successfully',
            content: {
                'application/json': {
                    schema: exports.getWaitlistSchemaVo,
                },
            },
        },
    },
    tags: ['auth', 'waitlist'],
});
const getWaitlist = async () => {
    return axios_1.axios.get(exports.GET_WAITLIST);
};
exports.getWaitlist = getWaitlist;
