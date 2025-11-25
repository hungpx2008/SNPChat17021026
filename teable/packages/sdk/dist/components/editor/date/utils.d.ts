import type { IDatetimeFormatting } from '@teable/core';
export declare const formatDisplayValue: (value: string, formatting: IDatetimeFormatting) => string;
export declare const convertZonedInputToUtc: (inputValue: string, formatting: IDatetimeFormatting) => string | null;
