import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord } from '@teable/core';
import { CellFormat, FieldKeyType } from '@teable/core';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export type { IRecord } from '@teable/core';
export declare const fieldKeyTypeRoSchema: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof FieldKeyType>>, FieldKeyType, FieldKeyType | undefined>>;
export declare const typecastSchema: z.ZodOptional<z.ZodBoolean>;
export declare const getRecordQuerySchema: z.ZodObject<{
    projection: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>, string[], string | string[]>>;
    cellFormat: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof CellFormat>>>;
    fieldKeyType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof FieldKeyType>>, FieldKeyType, FieldKeyType | undefined>>;
}, "strip", z.ZodTypeAny, {
    projection?: string[] | undefined;
    cellFormat?: CellFormat | undefined;
    fieldKeyType?: FieldKeyType | undefined;
}, {
    projection?: string | string[] | undefined;
    cellFormat?: CellFormat | undefined;
    fieldKeyType?: FieldKeyType | undefined;
}>;
export type IGetRecordQuery = z.infer<typeof getRecordQuerySchema>;
export declare const GET_RECORD_URL = "/table/{tableId}/record/{recordId}";
export declare const GetRecordRoute: RouteConfig;
export declare function getRecord(tableId: string, recordId: string, query?: IGetRecordQuery): Promise<AxiosResponse<IRecord>>;
