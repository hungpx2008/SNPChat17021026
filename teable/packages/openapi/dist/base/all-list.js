"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseAll = exports.GetBaseAllRoute = exports.GET_BASE_ALL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.GET_BASE_ALL = '/base/access/all';
exports.GetBaseAllRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_BASE_ALL,
    description: 'Get base list by query',
    request: {},
    responses: {
        200: {
            description: 'Returns the list of base.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(get_1.getBaseItemSchema),
                },
            },
        },
    },
    tags: ['base'],
});
const getBaseAll = async () => {
    return axios_1.axios.get(exports.GET_BASE_ALL);
};
exports.getBaseAll = getBaseAll;
