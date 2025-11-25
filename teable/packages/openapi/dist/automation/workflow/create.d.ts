import { z } from '../../zod';
declare const workflowRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    trigger?: unknown;
}, {
    name?: string | undefined;
    description?: string | undefined;
    trigger?: unknown;
}>;
type IWorkflowRo = z.infer<typeof workflowRoSchema>;
export declare const createWorkflow: (baseId: string, createWorkflowRo?: IWorkflowRo) => Promise<import("axios").AxiosResponse<unknown, any>>;
export {};
