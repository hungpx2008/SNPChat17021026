"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupPoints = exports.GetGroupPointsRoute = exports.GET_GROUP_POINTS = exports.groupPointsRoSchema = void 0;
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const type_1 = require("./type");
exports.groupPointsRoSchema = record_1.contentQueryBaseSchema.pick({
    viewId: true,
    filter: true,
    search: true,
    groupBy: true,
    collapsedGroupIds: true,
    ignoreViewQuery: true,
});
exports.GET_GROUP_POINTS = '/table/{tableId}/aggregation/group-points';
exports.GetGroupPointsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_GROUP_POINTS,
    summary: 'Get group points',
    description: 'Returns the distribution and count of records across different group points in the view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.groupPointsRoSchema,
    },
    responses: {
        200: {
            description: 'Group points for the view',
            content: {
                'application/json': {
                    schema: type_1.groupPointsVoSchema,
                },
            },
        },
    },
    tags: ['aggregation'],
});
const getGroupPoints = async (tableId, query) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_GROUP_POINTS, { tableId }), {
        params: {
            ...query,
            filter: JSON.stringify(query?.filter),
            groupBy: JSON.stringify(query?.groupBy),
            collapsedGroupIds: JSON.stringify(query?.collapsedGroupIds),
        },
    });
};
exports.getGroupPoints = getGroupPoints;
