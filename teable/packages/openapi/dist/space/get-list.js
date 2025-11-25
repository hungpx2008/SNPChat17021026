"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceList = exports.GetSpaceListRoute = exports.GET_SPACE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.GET_SPACE_LIST = '/space';
exports.GetSpaceListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_SPACE_LIST,
    summary: 'Get space list',
    description: 'Get space list by query',
    request: {},
    responses: {
        200: {
            description: 'Returns the list of space.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(get_1.getSpaceVoSchema),
                },
            },
        },
    },
    tags: ['space'],
});
const getSpaceList = async () => {
    return axios_1.axios.get(exports.GET_SPACE_LIST);
};
exports.getSpaceList = getSpaceList;
