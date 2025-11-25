"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWaitlist = exports.JoinWaitlistRoute = exports.joinWaitlistSchemaVo = exports.joinWaitlistSchemaRo = exports.JOIN_WAITLIST = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.JOIN_WAITLIST = '/auth/join-waitlist';
exports.joinWaitlistSchemaRo = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.joinWaitlistSchemaVo = exports.joinWaitlistSchemaRo;
exports.JoinWaitlistRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.JOIN_WAITLIST,
    description: 'Join waitlist',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.joinWaitlistSchemaRo,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Join waitlist successfully',
            content: {
                'application/json': {
                    schema: exports.joinWaitlistSchemaVo,
                },
            },
        },
    },
    tags: ['auth', 'waitlist'],
});
const joinWaitlist = async (body) => {
    return axios_1.axios.post(exports.JOIN_WAITLIST, body);
};
exports.joinWaitlist = joinWaitlist;
