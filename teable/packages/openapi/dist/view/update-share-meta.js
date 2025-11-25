"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewShareMeta = exports.updateViewShareMetaRoute = exports.viewShareMetaRoSchema = exports.VIEW_SHARE_META = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_SHARE_META = '/table/{tableId}/view/{viewId}/share-meta';
exports.viewShareMetaRoSchema = core_1.shareViewMetaSchema;
exports.updateViewShareMetaRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_SHARE_META,
    description: 'Update view share meta',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewShareMetaRoSchema,
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
const updateViewShareMeta = async (tableId, viewId, shareMeta) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_SHARE_META, {
        tableId,
        viewId,
    }), shareMeta);
};
exports.updateViewShareMeta = updateViewShareMeta;
