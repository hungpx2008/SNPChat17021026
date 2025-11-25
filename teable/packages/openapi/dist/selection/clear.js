"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.ClearRoute = exports.CLEAR_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const range_1 = require("./range");
exports.CLEAR_URL = '/table/{tableId}/selection/clear';
exports.ClearRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.CLEAR_URL,
    summary: 'Clear selected range content',
    description: 'Remove all content from the selected table range',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: range_1.rangesRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful clean up',
        },
    },
    tags: ['selection'],
});
const clear = async (tableId, clearRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.CLEAR_URL, {
        tableId,
    }), clearRo);
};
exports.clear = clear;
