"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultViewId = exports.GetDefaultViewIdRoute = exports.getDefaultViewIdVoSchema = exports.GET_DEFAULT_VIEW_ID = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_DEFAULT_VIEW_ID = '/base/{baseId}/table/{tableId}/default-view-id';
exports.getDefaultViewIdVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.GetDefaultViewIdRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DEFAULT_VIEW_ID,
    summary: 'Get default view id',
    description: 'Get default view id',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns default view id',
            content: {
                'application/json': {
                    schema: exports.getDefaultViewIdVoSchema,
                },
            },
        },
    },
    tags: ['table'],
});
const getDefaultViewId = async (baseId, tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DEFAULT_VIEW_ID, { baseId, tableId }));
};
exports.getDefaultViewId = getDefaultViewId;
