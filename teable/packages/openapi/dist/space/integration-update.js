"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIntegration = exports.UpdateIntegrationRoute = exports.updateIntegrationRoSchema = exports.UPDATE_INTEGRATION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const integration_get_list_1 = require("./integration-get-list");
exports.UPDATE_INTEGRATION = '/space/{spaceId}/integration/{integrationId}';
exports.updateIntegrationRoSchema = zod_1.z.object({
    enable: zod_1.z.boolean().optional(),
    config: integration_get_list_1.integrationConfigSchema.optional(),
});
exports.UpdateIntegrationRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_INTEGRATION,
    description: 'Update a integration to a space',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
            integrationId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateIntegrationRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful response.',
        },
    },
    tags: ['space', 'integration'],
});
const updateIntegration = async (spaceId, integrationId, updateIntegrationRo) => {
    return await axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_INTEGRATION, {
        spaceId,
        integrationId,
    }), updateIntegrationRo);
};
exports.updateIntegration = updateIntegration;
