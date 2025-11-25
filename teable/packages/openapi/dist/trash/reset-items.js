"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTrashItems = exports.ResetTrashItemsRoute = exports.resetTrashItemsRoSchema = exports.RESET_TRASH_ITEMS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const get_items_1 = require("./get-items");
exports.RESET_TRASH_ITEMS = '/trash/reset-items';
exports.resetTrashItemsRoSchema = get_items_1.trashItemsRoSchema;
exports.ResetTrashItemsRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.RESET_TRASH_ITEMS,
    description: 'Reset trash items for a base or table',
    request: {
        query: exports.resetTrashItemsRoSchema,
    },
    responses: {
        200: {
            description: 'Reset successfully',
        },
    },
    tags: ['base'],
});
const resetTrashItems = async (resetTrashItemsRo) => {
    return axios_1.axios.delete(exports.RESET_TRASH_ITEMS, { params: resetTrashItemsRo });
};
exports.resetTrashItems = resetTrashItems;
