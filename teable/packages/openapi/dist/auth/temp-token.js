"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempToken = exports.getTempTokenRoute = exports.getTempTokenVoSchema = exports.GET_TEMP_TOKEN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_TEMP_TOKEN = '/auth/temp-token';
exports.getTempTokenVoSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    expiresTime: zod_1.z.string(),
});
exports.getTempTokenRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TEMP_TOKEN,
    description: 'Get temp token',
    responses: {
        200: {
            description: 'Get temp token successfully',
            content: {
                'application/json': {
                    schema: exports.getTempTokenVoSchema,
                },
            },
        },
    },
    tags: ['auth'],
});
const getTempToken = () => axios_1.axios.get(exports.GET_TEMP_TOKEN);
exports.getTempToken = getTempToken;
