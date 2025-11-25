"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFile = exports.AnalyzeTableRoute = exports.ANALYZE_FILE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const types_1 = require("./types");
exports.ANALYZE_FILE = '/import/analyze';
exports.AnalyzeTableRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.ANALYZE_FILE,
    description: 'Get a column info from analyze sheet',
    request: {
        query: types_1.analyzeRoSchema,
    },
    responses: {
        200: {
            description: 'Returns columnHeader analyze from file',
            content: {
                'application/json': {
                    schema: types_1.analyzeVoSchema,
                },
            },
        },
    },
    tags: ['import'],
});
const analyzeFile = async (analyzeRo) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.ANALYZE_FILE), { params: analyzeRo });
};
exports.analyzeFile = analyzeFile;
