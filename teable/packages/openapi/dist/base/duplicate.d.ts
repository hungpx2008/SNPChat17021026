import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DUPLICATE_BASE = "/base/duplicate";
export declare const duplicateBaseRoSchema: z.ZodObject<{
    fromBaseId: z.ZodString;
    spaceId: z.ZodString;
    withRecords: z.ZodOptional<z.ZodBoolean>;
    name: z.ZodOptional<z.ZodString>;
    baseId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
    fromBaseId: string;
    name?: string | undefined;
    baseId?: string | undefined;
    withRecords?: boolean | undefined;
}, {
    spaceId: string;
    fromBaseId: string;
    name?: string | undefined;
    baseId?: string | undefined;
    withRecords?: boolean | undefined;
}>;
export type IDuplicateBaseRo = z.infer<typeof duplicateBaseRoSchema>;
export declare const DuplicateBaseRoute: RouteConfig;
export declare const duplicateBase: (params: IDuplicateBaseRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    spaceId: string;
}, any>>;
