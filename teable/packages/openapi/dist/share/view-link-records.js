"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewLinkRecords = exports.ShareViewLinkRecordsRoute = exports.shareViewLinkRecordsVoSchema = exports.shareViewLinkRecordsRoSchema = exports.ShareViewLinkRecordsType = exports.SHARE_VIEW_LINK_RECORDS = void 0;
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_LINK_RECORDS = '/share/{shareId}/view/link-records';
var ShareViewLinkRecordsType;
(function (ShareViewLinkRecordsType) {
    ShareViewLinkRecordsType["Candidate"] = "candidate";
    ShareViewLinkRecordsType["Selected"] = "selected";
})(ShareViewLinkRecordsType || (exports.ShareViewLinkRecordsType = ShareViewLinkRecordsType = {}));
exports.shareViewLinkRecordsRoSchema = record_1.getRecordsRoSchema
    .pick({
    take: true,
    skip: true,
})
    .extend({
    fieldId: zod_1.z.string(),
    search: zod_1.z.string().optional(),
    type: zod_1.z
        .nativeEnum(ShareViewLinkRecordsType)
        .optional()
        .openapi({ description: 'Only used for plugin views' }),
});
exports.shareViewLinkRecordsVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string().optional(),
}));
exports.ShareViewLinkRecordsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_LINK_RECORDS,
    description: 'In a view with a field selector, link the records list of the associated field selector to get the. Linking the desired ones inside the share view should fetch the ones that have already been selected.',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewLinkRecordsRoSchema,
    },
    responses: {
        200: {
            description: 'Link records list',
            content: {
                'application/json': {
                    schema: exports.shareViewLinkRecordsVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewLinkRecords = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_LINK_RECORDS, { shareId }), {
        params: query,
    });
};
exports.getShareViewLinkRecords = getShareViewLinkRecords;
