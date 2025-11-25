"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUsage = exports.GetBaseUsageRoute = exports.GET_BASE_USAGE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_space_usage_1 = require("./get-space-usage");
exports.GET_BASE_USAGE = '/base/{baseId}/usage';
exports.GetBaseUsageRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_BASE_USAGE,
    description: 'Get usage information for the base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns usage information for the base.',
            content: {
                'application/json': {
                    schema: get_space_usage_1.usageVoSchema,
                },
            },
        },
    },
    tags: ['usage'],
});
const getBaseUsage = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_BASE_USAGE, { baseId }));
};
exports.getBaseUsage = getBaseUsage;
