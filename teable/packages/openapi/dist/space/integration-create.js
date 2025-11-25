"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIntegration = exports.CreateIntegrationRoute = exports.createIntegrationRoSchema = exports.CREATE_INTEGRATION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const integration_get_list_1 = require("./integration-get-list");
exports.CREATE_INTEGRATION = '/space/{spaceId}/integration';
exports.createIntegrationRoSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(integration_get_list_1.IntegrationType),
    enable: zod_1.z.boolean().optional(),
    config: integration_get_list_1.integrationConfigSchema,
});
exports.CreateIntegrationRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_INTEGRATION,
    description: 'Create a integration to a space',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.createIntegrationRoSchema,
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
const createIntegration = async (spaceId, createIntegrationRo) => {
    return await axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_INTEGRATION, {
        spaceId,
    }), createIntegrationRo);
};
exports.createIntegration = createIntegration;
