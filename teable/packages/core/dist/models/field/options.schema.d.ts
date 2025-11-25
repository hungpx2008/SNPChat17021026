import { FieldType } from './constant';
export declare function safeParseOptions(fieldType: FieldType, value: unknown): import("zod").SafeParseSuccess<{}> | import("zod").SafeParseError<{}>;
