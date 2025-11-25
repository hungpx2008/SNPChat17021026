"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIntegrationLLM = exports.TEST_INTEGRATION_LLM = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.TEST_INTEGRATION_LLM = '/space/{spaceId}/test-llm';
const testIntegrationLLM = async (spaceId, data) => {
    const response = await axios_1.axios.post((0, utils_1.urlBuilder)(exports.TEST_INTEGRATION_LLM, { spaceId }), data);
    return response.data;
};
exports.testIntegrationLLM = testIntegrationLLM;
