import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
export declare const BUTTON_CLICK = "/table/{tableId}/record/{recordId}/{fieldId}/button-click";
export declare const buttonClickVoSchema: z.ZodObject<{
    runId: z.ZodString;
    tableId: z.ZodString;
    fieldId: z.ZodString;
    record: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        autoNumber: z.ZodOptional<z.ZodNumber>;
        createdTime: z.ZodOptional<z.ZodString>;
        lastModifiedTime: z.ZodOptional<z.ZodString>;
        createdBy: z.ZodOptional<z.ZodString>;
        lastModifiedBy: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
        undeletable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }, {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    record: {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    };
    fieldId: string;
    runId: string;
}, {
    tableId: string;
    record: {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    };
    fieldId: string;
    runId: string;
}>;
export type IButtonClickVo = z.infer<typeof buttonClickVoSchema>;
export declare const ButtonClickRoute: RouteConfig;
export declare function buttonClick(tableId: string, recordId: string, fieldId: string): Promise<AxiosResponse<IButtonClickVo>>;
