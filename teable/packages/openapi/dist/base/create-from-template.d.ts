import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_BASE_FROM_TEMPLATE = "/base/create-from-template";
export declare const createBaseFromTemplateRoSchema: z.ZodObject<{
    spaceId: z.ZodString;
    templateId: z.ZodString;
    withRecords: z.ZodOptional<z.ZodBoolean>;
    baseId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
    templateId: string;
    baseId?: string | undefined;
    withRecords?: boolean | undefined;
}, {
    spaceId: string;
    templateId: string;
    baseId?: string | undefined;
    withRecords?: boolean | undefined;
}>;
export type ICreateBaseFromTemplateRo = z.infer<typeof createBaseFromTemplateRoSchema>;
export declare const CreateBaseFromTemplateRoute: RouteConfig;
export declare const createBaseFromTemplate: (createBaseRo: ICreateBaseFromTemplateRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    spaceId: string;
}, any>>;
