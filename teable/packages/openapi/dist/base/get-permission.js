"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePermission = exports.GetBasePermissionRoute = exports.GetBasePermissionVoSchema = exports.GET_BASE_PERMISSION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_BASE_PERMISSION = '/base/{baseId}/permission';
exports.GetBasePermissionVoSchema = zod_1.z.record(zod_1.z.custom(), zod_1.z.boolean());
exports.GetBasePermissionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_BASE_PERMISSION,
    description: 'Get a base permission',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about a base permission.',
            content: {
                'application/json': {
                    schema: exports.GetBasePermissionVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const getBasePermission = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_BASE_PERMISSION, {
        baseId,
    }));
};
exports.getBasePermission = getBasePermission;
