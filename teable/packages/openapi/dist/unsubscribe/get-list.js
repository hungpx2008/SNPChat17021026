"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnSubscribeList = exports.getUnSubscribeListRoute = exports.unsubscribeListPaginatedVoSchema = exports.unsubscribeListVoSchema = exports.unsubscribeItemVoSchema = exports.GET_UNSUBSCRIBE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_UNSUBSCRIBE_LIST = '/unsubscribe/list/{baseId}';
exports.unsubscribeItemVoSchema = zod_1.z.object({
    email: zod_1.z.string(),
    createdTime: zod_1.z.string(),
});
exports.unsubscribeListVoSchema = zod_1.z.array(exports.unsubscribeItemVoSchema);
exports.unsubscribeListPaginatedVoSchema = zod_1.z.object({
    data: exports.unsubscribeListVoSchema,
    hasMore: zod_1.z.boolean(),
    pageSize: zod_1.z.number(),
});
exports.getUnSubscribeListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_UNSUBSCRIBE_LIST,
    description: 'Get paginated unsubscribe list by baseId',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10).optional(),
            cursor: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Returns paginated unsubscribe list.',
            content: {
                'application/json': {
                    schema: exports.unsubscribeListPaginatedVoSchema,
                },
            },
        },
    },
    tags: ['unsubscribe'],
});
const getUnSubscribeList = async (baseId, params) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_UNSUBSCRIBE_LIST, { baseId }), {
        params,
    });
};
exports.getUnSubscribeList = getUnSubscribeList;
