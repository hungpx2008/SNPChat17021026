import { PrincipalType } from '../space/types';
import { z } from '../zod';
export declare const SHARE_VIEW_COLLABORATORS = "/share/{shareId}/view/collaborators";
export declare const shareViewCollaboratorsRoSchema: z.ZodObject<{
    fieldId: z.ZodOptional<z.ZodString>;
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof PrincipalType>>;
}, "strip", z.ZodTypeAny, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    fieldId?: string | undefined;
}, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    fieldId?: string | undefined;
}>;
export type IShareViewCollaboratorsRo = z.infer<typeof shareViewCollaboratorsRoSchema>;
export declare const shareViewCollaboratorsVoSchema: z.ZodArray<z.ZodObject<{
    userId: z.ZodString;
    userName: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    userId: string;
    userName: string;
    avatar?: string | null | undefined;
}, {
    email: string;
    userId: string;
    userName: string;
    avatar?: string | null | undefined;
}>, "many">;
export type IShareViewCollaboratorsVo = z.infer<typeof shareViewCollaboratorsVoSchema>;
export declare const ShareViewCollaboratorsRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const getShareViewCollaborators: (shareId: string, query?: IShareViewCollaboratorsRo) => Promise<import("axios").AxiosResponse<{
    email: string;
    userId: string;
    userName: string;
    avatar?: string | null | undefined;
}[], any>>;
