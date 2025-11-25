"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTableFromFile = exports.ImportTableFromFileRoute = exports.IMPORT_TABLE = void 0;
const axios_1 = require("../axios");
const table_1 = require("../table");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.IMPORT_TABLE = '/import/{baseId}';
exports.ImportTableFromFileRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.IMPORT_TABLE,
    description: 'create table from file',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: types_1.importOptionRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about a table without records',
            content: {
                'application/json': {
                    schema: table_1.tableVoSchema,
                },
            },
        },
    },
    tags: ['import'],
});
const importTableFromFile = async (baseId, importRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.IMPORT_TABLE, { baseId }), importRo);
};
exports.importTableFromFile = importTableFromFile;
