"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceUsage = exports.GetInstanceUsageRoute = exports.GET_INSTANCE_USAGE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const get_space_usage_1 = require("./get-space-usage");
exports.GET_INSTANCE_USAGE = '/instance/usage';
exports.GetInstanceUsageRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_INSTANCE_USAGE,
    description: 'Get usage information for the instance',
    request: {},
    responses: {
        200: {
            description: 'Returns usage information for the instance.',
            content: {
                'application/json': {
                    schema: get_space_usage_1.usageVoSchema,
                },
            },
        },
    },
    tags: ['usage'],
});
const getInstanceUsage = async () => {
    return axios_1.axios.get(exports.GET_INSTANCE_USAGE);
};
exports.getInstanceUsage = getInstanceUsage;
