"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.CopyRoute = exports.copyVoSchema = exports.COPY_URL = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const range_1 = require("./range");
exports.COPY_URL = '/table/{tableId}/selection/copy';
exports.copyVoSchema = zod_1.z.object({
    content: zod_1.z.string(),
    header: core_1.fieldVoSchema.array(),
});
exports.CopyRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.COPY_URL,
    summary: 'Copy selected table content',
    description: 'Copy content from selected table ranges including headers if specified',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: range_1.rangesQuerySchema,
    },
    responses: {
        200: {
            description: 'Copy content',
            content: {
                'application/json': {
                    schema: exports.copyVoSchema,
                },
            },
        },
    },
    tags: ['selection'],
});
const copy = async (tableId, copyRo) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.COPY_URL, {
        tableId,
    }), {
        params: {
            ...copyRo,
            filter: JSON.stringify(copyRo.filter),
            orderBy: JSON.stringify(copyRo.orderBy),
            groupBy: JSON.stringify(copyRo.groupBy),
            ranges: JSON.stringify(copyRo.ranges),
            collapsedGroupIds: JSON.stringify(copyRo.collapsedGroupIds),
        },
    });
};
exports.copy = copy;
