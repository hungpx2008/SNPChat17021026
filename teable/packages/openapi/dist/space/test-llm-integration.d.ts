import type { ITestLLMRo, ITestLLMVo } from '../admin';
export declare const TEST_INTEGRATION_LLM = "/space/{spaceId}/test-llm";
export declare const testIntegrationLLM: (spaceId: string, data: ITestLLMRo) => Promise<ITestLLMVo>;
