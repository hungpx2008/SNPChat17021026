"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrashItems = exports.GetTrashItemsRoute = exports.trashItemsRoSchema = exports.GET_TRASH_ITEMS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
exports.GET_TRASH_ITEMS = '/trash/items';
exports.trashItemsRoSchema = zod_1.z.object({
    resourceId: zod_1.z.string(),
    resourceType: zod_1.z.enum([get_1.ResourceType.Base, get_1.ResourceType.Table]),
    cursor: zod_1.z.string().nullish(),
});
exports.GetTrashItemsRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TRASH_ITEMS,
    description: 'Get trash items for base or table',
    request: {
        query: exports.trashItemsRoSchema,
    },
    responses: {
        200: {
            description: 'Get trash successfully',
            content: {
                'application/json': {
                    schema: get_1.trashVoSchema,
                },
            },
        },
    },
    tags: ['trash'],
});
const getTrashItems = (trashItemsRo) => {
    return axios_1.axios.get(exports.GET_TRASH_ITEMS, { params: trashItemsRo });
};
exports.getTrashItems = getTrashItems;
