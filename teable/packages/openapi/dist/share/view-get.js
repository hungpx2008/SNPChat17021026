"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareView = exports.ShareViewGetRouter = exports.shareViewGetVoSchema = exports.SHARE_VIEW_GET = void 0;
const core_1 = require("@teable/core");
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const plugin_get_1 = require("../view/plugin-get");
const zod_1 = require("../zod");
exports.SHARE_VIEW_GET = '/share/{shareId}/view';
const shareViewPluginSchema = plugin_get_1.getViewInstallPluginVoSchema.omit({ baseId: true });
exports.shareViewGetVoSchema = zod_1.z.object({
    viewId: zod_1.z.string().optional(),
    tableId: zod_1.z.string(),
    shareId: zod_1.z.string(),
    shareMeta: core_1.shareViewMetaSchema.optional(),
    view: core_1.viewVoSchema.optional(),
    fields: core_1.fieldVoSchema.array(),
    records: core_1.recordSchema.array().openapi({ description: 'first 50 records' }),
    extra: zod_1.z
        .object({
        groupPoints: aggregation_1.groupPointsVoSchema.optional().openapi({
            description: 'Group points for the view',
        }),
        plugin: shareViewPluginSchema.optional(),
    })
        .optional(),
});
exports.ShareViewGetRouter = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_GET,
    description: 'get share view info',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'share view info',
            content: {
                'application/json': {
                    schema: exports.shareViewGetVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareView = (shareId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_GET, { shareId }));
};
exports.getShareView = getShareView;
