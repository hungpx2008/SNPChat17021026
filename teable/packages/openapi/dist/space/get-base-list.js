"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseList = exports.GetBaseListRoute = exports.getBaseListRoSchema = exports.GET_BASE_LIST = void 0;
const axios_1 = require("../axios");
const base_1 = require("../base");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_BASE_LIST = '/space/{spaceId}/base';
exports.getBaseListRoSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
});
exports.GetBaseListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_BASE_LIST,
    description: 'Get base list by query',
    request: {
        params: exports.getBaseListRoSchema,
    },
    responses: {
        200: {
            description: 'Returns the list of base.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(base_1.getBaseItemSchema),
                },
            },
        },
    },
    tags: ['base'],
});
const getBaseList = async (query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_BASE_LIST, query));
};
exports.getBaseList = getBaseList;
