"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableDescription = exports.updateTableDescriptionRoute = exports.tableDescriptionRoSchema = exports.TABLE_DESCRIPTION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.TABLE_DESCRIPTION = '/base/{baseId}/table/{tableId}/description';
exports.tableDescriptionRoSchema = zod_1.z.object({
    description: zod_1.z.string().nullable(),
});
exports.updateTableDescriptionRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.TABLE_DESCRIPTION,
    summary: 'Update table description',
    description: 'Update or remove the description of a table. Set to null to remove the description.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.tableDescriptionRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Table description successfully updated.',
        },
    },
    tags: ['table'],
});
const updateTableDescription = async (baseId, tableId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.TABLE_DESCRIPTION, {
        baseId,
        tableId,
    }), data);
};
exports.updateTableDescription = updateTableDescription;
