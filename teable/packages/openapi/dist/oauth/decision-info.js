"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decisionInfoGet = exports.decisionInfoGetRoute = exports.decisionInfoGetVoSchema = exports.DECISION_INFO_GET = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DECISION_INFO_GET = '/oauth/decision/{transactionId}';
exports.decisionInfoGetVoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    homepage: zod_1.z.string().url(),
    logo: zod_1.z.string().url().optional(),
    scopes: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.decisionInfoGetRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.DECISION_INFO_GET,
    description: 'Get the OAuth application',
    request: {
        params: zod_1.z.object({
            transactionId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the OAuth application',
            content: {
                'application/json': {
                    schema: exports.decisionInfoGetVoSchema,
                },
            },
        },
    },
    tags: ['oauth'],
});
const decisionInfoGet = async (transactionId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.DECISION_INFO_GET, { transactionId }));
};
exports.decisionInfoGet = decisionInfoGet;
