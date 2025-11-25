"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewColumnMeta = exports.updateViewColumnMetaRoute = exports.VIEW_COLUMN_META = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_COLUMN_META = '/table/{tableId}/view/{viewId}/column-meta';
exports.updateViewColumnMetaRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_COLUMN_META,
    description: 'Update view column meta',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.columnMetaRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully update.',
        },
    },
    tags: ['view'],
});
const updateViewColumnMeta = async (tableId, viewId, columnMetaRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_COLUMN_META, {
        tableId,
        viewId,
    }), columnMetaRo);
};
exports.updateViewColumnMeta = updateViewColumnMeta;
