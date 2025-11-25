import { z } from 'zod';
export declare enum GroupPointType {
    Header = 0,
    Row = 1
}
declare const groupHeaderPointSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<GroupPointType.Header>;
    depth: z.ZodNumber;
    value: z.ZodUnknown;
    isCollapsed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}>;
export declare const groupHeaderRefSchema: z.ZodObject<{
    id: z.ZodString;
    depth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    depth: number;
}, {
    id: string;
    depth: number;
}>;
declare const groupPointSchema: z.ZodUnion<[z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<GroupPointType.Header>;
    depth: z.ZodNumber;
    value: z.ZodUnknown;
    isCollapsed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}>, z.ZodObject<{
    type: z.ZodLiteral<GroupPointType.Row>;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: GroupPointType.Row;
    count: number;
}, {
    type: GroupPointType.Row;
    count: number;
}>]>;
export type IGroupHeaderPoint = z.infer<typeof groupHeaderPointSchema>;
export type IGroupHeaderRef = z.infer<typeof groupHeaderRefSchema>;
export type IGroupPoint = z.infer<typeof groupPointSchema>;
export declare const groupPointsVoSchema: z.ZodNullable<z.ZodArray<z.ZodUnion<[z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<GroupPointType.Header>;
    depth: z.ZodNumber;
    value: z.ZodUnknown;
    isCollapsed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}, {
    type: GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
}>, z.ZodObject<{
    type: z.ZodLiteral<GroupPointType.Row>;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: GroupPointType.Row;
    count: number;
}, {
    type: GroupPointType.Row;
    count: number;
}>]>, "many">>;
export type IGroupPointsVo = z.infer<typeof groupPointsVoSchema>;
export {};
