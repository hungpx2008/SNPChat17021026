"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIntegration = exports.DeleteIntegrationRoute = exports.DELETE_INTEGRATION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_INTEGRATION = '/space/{spaceId}/integration/{integrationId}';
exports.DeleteIntegrationRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_INTEGRATION,
    description: 'Delete a integration by integrationId',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
            integrationId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['space', 'integration'],
});
const deleteIntegration = async (spaceId, integrationId) => {
    return await axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_INTEGRATION, {
        spaceId,
        integrationId,
    }));
};
exports.deleteIntegration = deleteIntegration;
