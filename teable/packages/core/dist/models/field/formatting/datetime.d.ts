import { z } from '../../../zod';
import { timeZoneStringSchema } from './time-zone';
export declare enum DateFormattingPreset {
    US = "M/D/YYYY",
    European = "D/M/YYYY",
    Asian = "YYYY/MM/DD",
    ISO = "YYYY-MM-DD",
    YM = "YYYY-MM",
    MD = "MM-DD",
    Y = "YYYY",
    M = "MM",
    D = "DD"
}
export declare enum TimeFormatting {
    Hour24 = "HH:mm",
    Hour12 = "hh:mm A",
    None = "None"
}
export declare const datetimeFormattingSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodNativeEnum<typeof TimeFormatting>;
    timeZone: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    date: string;
    timeZone: string;
    time: TimeFormatting;
}, {
    date: string;
    timeZone: string;
    time: TimeFormatting;
}>;
export type ITimeZoneString = z.infer<typeof timeZoneStringSchema>;
export type IDatetimeFormatting = z.infer<typeof datetimeFormattingSchema>;
export declare const defaultDatetimeFormatting: IDatetimeFormatting;
export declare const formatDateToString: (cellValue: string | undefined, formatting: IDatetimeFormatting) => string;
export declare const normalizeDateFormatting: (dateFormatting: string) => string;
