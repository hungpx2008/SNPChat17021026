import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const SHARE_VIEW_BUTTON_CLICK = "/share/{shareId}/view/record/{recordId}/{fieldId}/button-click";
export declare const ShareViewButtonClickRoute: RouteConfig;
export declare function shareViewButtonClick(shareId: string, recordId: string, fieldId: string): Promise<import("axios").AxiosResponse<{
    tableId: string;
    record: {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    };
    fieldId: string;
    runId: string;
}, any>>;
