"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginRegenerateSecret = exports.pluginRegenerateSecretRoute = exports.pluginRegenerateSecretVoSchema = exports.pluginRegenerateSecretRoSchema = exports.PLUGIN_REGENERATE_SECRET = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_REGENERATE_SECRET = '/plugin/{id}/regenerate-secret';
exports.pluginRegenerateSecretRoSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.pluginRegenerateSecretVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    secret: zod_1.z.string(),
});
exports.pluginRegenerateSecretRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLUGIN_REGENERATE_SECRET,
    description: 'Regenerate a plugin secret',
    request: {
        params: exports.pluginRegenerateSecretRoSchema,
    },
    responses: {
        201: {
            description: 'Returns data about the plugin.',
            content: {
                'application/json': {
                    schema: exports.pluginRegenerateSecretVoSchema,
                },
            },
        },
    },
    tags: ['plugin'],
});
const pluginRegenerateSecret = async (id) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLUGIN_REGENERATE_SECRET, { id }));
};
exports.pluginRegenerateSecret = pluginRegenerateSecret;
