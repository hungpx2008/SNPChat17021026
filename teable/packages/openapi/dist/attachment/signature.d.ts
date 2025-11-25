import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare enum UploadType {
    Table = 1,
    Avatar = 2,
    Form = 3,
    OAuth = 4,
    Import = 5,
    Plugin = 6,
    Comment = 7,
    Logo = 8,
    ExportBase = 9,
    Template = 10,
    ChatDataVisualizationCode = 11,
    App = 12,
    ChatFile = 13,
    Automation = 14
}
export declare const signatureRoSchema: z.ZodObject<{
    contentType: z.ZodString;
    contentLength: z.ZodNumber;
    expiresIn: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodOptional<z.ZodString>;
    type: z.ZodNativeEnum<typeof UploadType>;
    baseId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: UploadType;
    contentType: string;
    contentLength: number;
    baseId?: string | undefined;
    expiresIn?: number | undefined;
    hash?: string | undefined;
}, {
    type: UploadType;
    contentType: string;
    contentLength: number;
    baseId?: string | undefined;
    expiresIn?: number | undefined;
    hash?: string | undefined;
}>;
export type SignatureRo = z.infer<typeof signatureRoSchema>;
export declare const signatureVoSchema: z.ZodObject<{
    url: z.ZodString;
    uploadMethod: z.ZodString;
    token: z.ZodString;
    requestHeaders: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    url: string;
    token: string;
    uploadMethod: string;
    requestHeaders: Record<string, unknown>;
}, {
    url: string;
    token: string;
    uploadMethod: string;
    requestHeaders: Record<string, unknown>;
}>;
export type SignatureVo = z.infer<typeof signatureVoSchema>;
export declare const SIGNATURE_URL = "/attachments/signature";
export declare const SignatureRoute: RouteConfig;
export declare const getSignature: (params: SignatureRo, shareId?: string) => Promise<import("axios").AxiosResponse<{
    url: string;
    token: string;
    uploadMethod: string;
    requestHeaders: Record<string, unknown>;
}, any>>;
