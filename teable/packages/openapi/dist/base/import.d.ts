import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const IMPORT_BASE = "/base/import";
export declare const importBaseVoSchema: z.ZodObject<{
    base: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        spaceId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        spaceId: string;
    }, {
        name: string;
        id: string;
        spaceId: string;
    }>;
    tableIdMap: z.ZodRecord<z.ZodString, z.ZodString>;
    fieldIdMap: z.ZodRecord<z.ZodString, z.ZodString>;
    viewIdMap: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    base: {
        name: string;
        id: string;
        spaceId: string;
    };
    tableIdMap: Record<string, string>;
    fieldIdMap: Record<string, string>;
    viewIdMap: Record<string, string>;
}, {
    base: {
        name: string;
        id: string;
        spaceId: string;
    };
    tableIdMap: Record<string, string>;
    fieldIdMap: Record<string, string>;
    viewIdMap: Record<string, string>;
}>;
export type IImportBaseVo = z.infer<typeof importBaseVoSchema>;
export declare const importBaseRoSchema: z.ZodObject<{
    notify: z.ZodObject<{
        token: z.ZodString;
        size: z.ZodNumber;
        url: z.ZodString;
        path: z.ZodString;
        mimetype: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        presignedUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    }>;
    spaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
    notify: {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
}, {
    spaceId: string;
    notify: {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
}>;
export type ImportBaseRo = z.infer<typeof importBaseRoSchema>;
export declare const ImportBaseRoute: RouteConfig;
export declare const importBase: (importBaseRo: ImportBaseRo) => Promise<import("axios").AxiosResponse<{
    base: {
        name: string;
        id: string;
        spaceId: string;
    };
    tableIdMap: Record<string, string>;
    fieldIdMap: Record<string, string>;
    viewIdMap: Record<string, string>;
}, any>>;
