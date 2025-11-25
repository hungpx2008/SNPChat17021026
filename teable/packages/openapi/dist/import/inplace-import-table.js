"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inplaceImportTableFromFile = exports.inplaceImportTableFromFileRoute = exports.INPLACE_IMPORT_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.INPLACE_IMPORT_TABLE = '/import/{baseId}/{tableId}';
exports.inplaceImportTableFromFileRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.INPLACE_IMPORT_TABLE,
    description: 'import table inplace',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: types_1.inplaceImportOptionRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully import table inplace',
        },
    },
    tags: ['import'],
});
const inplaceImportTableFromFile = async (baseId, tableId, inplaceImportRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.INPLACE_IMPORT_TABLE, { baseId, tableId }), inplaceImportRo);
};
exports.inplaceImportTableFromFile = inplaceImportTableFromFile;
