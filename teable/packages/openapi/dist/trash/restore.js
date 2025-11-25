"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreTrash = exports.RestoreTrashRoute = exports.RESTORE_TRASH = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.RESTORE_TRASH = '/trash/restore/{trashId}';
exports.RestoreTrashRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.RESTORE_TRASH,
    description: 'restore a space, base, table, etc.',
    request: {
        params: zod_1.z.object({
            trashId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Restored successfully',
        },
    },
    tags: ['space'],
});
const restoreTrash = async (trashId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.RESTORE_TRASH, {
        trashId,
    }));
};
exports.restoreTrash = restoreTrash;
