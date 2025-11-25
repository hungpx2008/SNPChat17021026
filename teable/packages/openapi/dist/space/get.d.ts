import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_SPACE = "/space/{spaceId}";
export declare const getSpaceVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    organization: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    organization?: {
        name: string;
        id: string;
    } | undefined;
}, {
    name: string;
    id: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    organization?: {
        name: string;
        id: string;
    } | undefined;
}>;
export type IGetSpaceVo = z.infer<typeof getSpaceVoSchema>;
export declare const GetSpaceRoute: RouteConfig;
export declare const getSpaceById: (spaceId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    organization?: {
        name: string;
        id: string;
    } | undefined;
}, any>>;
