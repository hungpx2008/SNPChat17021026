import { z } from 'zod';
import type { IFieldVo } from './field.schema';
export declare const validateCellValue: (field: IFieldVo, cellValue: unknown) => z.SafeParseSuccess<any> | z.SafeParseError<any>;
export declare const validateDateFieldValueLoose: (cellValue: unknown, isMultipleCellValue?: boolean) => z.SafeParseReturnType<[string, ...string[]] | null, [string, ...string[]] | null> | z.SafeParseReturnType<string | null, string | null>;
