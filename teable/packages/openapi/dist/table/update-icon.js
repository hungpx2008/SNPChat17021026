"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableIcon = exports.updateTableIconRoute = exports.tableIconRoSchema = exports.TABLE_ICON = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.TABLE_ICON = '/base/{baseId}/table/{tableId}/icon';
exports.tableIconRoSchema = zod_1.z.object({
    icon: zod_1.z.string().emoji(),
});
exports.updateTableIconRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.TABLE_ICON,
    summary: 'Update table tcon',
    description: 'Update the emoji icon of a table. The icon must be a valid emoji character.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.tableIconRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Table icon successfully updated.',
        },
    },
    tags: ['table'],
});
const updateTableIcon = async (baseId, tableId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.TABLE_ICON, {
        baseId,
        tableId,
    }), data);
};
exports.updateTableIcon = updateTableIcon;
