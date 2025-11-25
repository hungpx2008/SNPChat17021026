"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveBase = exports.MoveBaseRoute = exports.moveBaseRoSchema = exports.MOVE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.MOVE_BASE = '/base/{baseId}/move';
exports.moveBaseRoSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
});
exports.MoveBaseRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.MOVE_BASE,
    description: 'move a base to another space',
    summary: 'move a base to another space',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.moveBaseRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'move to another space successfully',
        },
    },
    tags: ['base'],
});
const moveBase = async (baseId, spaceId) => {
    return await axios_1.axios.put((0, utils_1.urlBuilder)(exports.MOVE_BASE, {
        baseId,
    }), {
        spaceId,
    });
};
exports.moveBase = moveBase;
