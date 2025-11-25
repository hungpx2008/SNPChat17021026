"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareViewGroupPoints = exports.ShareViewGroupPointsRoute = exports.shareViewGroupPointsRoSchema = exports.SHARE_VIEW_GROUP_POINTS = void 0;
const aggregation_1 = require("../aggregation");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_GROUP_POINTS = '/share/{shareId}/view/group-points';
exports.shareViewGroupPointsRoSchema = aggregation_1.groupPointsRoSchema.omit({
    viewId: true,
});
exports.ShareViewGroupPointsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.SHARE_VIEW_GROUP_POINTS,
    description: 'Get group points for the share view',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        query: exports.shareViewGroupPointsRoSchema,
    },
    responses: {
        200: {
            description: 'Group points for the share view',
            content: {
                'application/json': {
                    schema: aggregation_1.groupPointsVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const getShareViewGroupPoints = async (shareId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.SHARE_VIEW_GROUP_POINTS, { shareId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            groupBy: JSON.stringify(query?.groupBy),
            collapsedGroupIds: JSON.stringify(query?.collapsedGroupIds),
        },
    });
};
exports.getShareViewGroupPoints = getShareViewGroupPoints;
