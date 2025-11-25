"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const workflowVoSchema = zod_1.z.unknown();
const CREATE_WORKFLOW = '/base/{baseId}/workflow';
const workflowRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    trigger: zod_1.z.unknown().optional(),
});
const createWorkflow = async (baseId, createWorkflowRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(CREATE_WORKFLOW, { baseId }), createWorkflowRo);
};
exports.createWorkflow = createWorkflow;
