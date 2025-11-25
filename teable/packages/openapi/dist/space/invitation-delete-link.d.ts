import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_SPACE_INVITATION_LINK = "/space/{spaceId}/invitation/link/{invitationId}";
export declare const DeleteSpaceInvitationLinkRoute: RouteConfig;
export declare const deleteSpaceInvitationLink: (params: {
    spaceId: string;
    invitationId: string;
}) => Promise<import("axios").AxiosResponse<any, any>>;
