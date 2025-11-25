import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_BASE_INVITATION_LINK = "/base/{baseId}/invitation/link/{invitationId}";
export declare const DeleteBaseInvitationLinkRoute: RouteConfig;
export declare const deleteBaseInvitationLink: (params: {
    baseId: string;
    invitationId: string;
}) => Promise<import("axios").AxiosResponse<any, any>>;
