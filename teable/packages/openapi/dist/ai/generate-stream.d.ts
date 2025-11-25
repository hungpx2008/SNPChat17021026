/// <reference types="node" />
import { z } from '../zod';
export declare enum Task {
    Coding = "coding",
    Embedding = "embedding",
    Translation = "translation"
}
export declare const AI_GENERATE_STREAM = "/api/{baseId}/ai/generate-stream";
export declare const aiGenerateRoSchema: z.ZodObject<{
    prompt: z.ZodString;
    task: z.ZodOptional<z.ZodNativeEnum<typeof Task>>;
    modelKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    modelKey?: string | undefined;
    task?: Task | undefined;
}, {
    prompt: string;
    modelKey?: string | undefined;
    task?: Task | undefined;
}>;
export type IAiGenerateRo = z.infer<typeof aiGenerateRoSchema>;
export declare const aiGenerateVoSchema: z.ZodObject<{
    result: z.ZodString;
}, "strip", z.ZodTypeAny, {
    result: string;
}, {
    result: string;
}>;
export type IAiGenerateVo = z.infer<typeof aiGenerateVoSchema>;
export declare const aiGenerateRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const aiGenerateStream: (baseId: string, aiGenerateRo: IAiGenerateRo, signal?: AbortSignal) => Promise<Response>;
