"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateSnapshot = exports.CreateTemplateSnapshotRoute = exports.CREATE_SNAPSHOT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_SNAPSHOT = '/template/{templateId}/snapshot';
exports.CreateTemplateSnapshotRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_SNAPSHOT,
    description: 'create a template snapshot',
    request: {
        params: zod_1.z.object({
            templateId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Successfully create template snapshot.',
        },
    },
    tags: ['template'],
});
const createTemplateSnapshot = async (templateId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_SNAPSHOT, { templateId }));
};
exports.createTemplateSnapshot = createTemplateSnapshot;
