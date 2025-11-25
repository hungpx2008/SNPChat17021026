/// <reference types="node" />
/// <reference types="node" />
import type { ReadStream } from 'fs';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import FormData from 'form-data';
export declare const UPLOAD_ATTACHMENT_URL = "/table/{tableId}/record/{recordId}/{fieldId}/uploadAttachment";
export declare const UploadAttachmentRoute: RouteConfig;
export declare const uploadAttachment: (tableId: string, recordId: string, fieldId: string, file?: Buffer | ReadStream | string, options?: FormData.AppendOptions | string) => Promise<import("axios").AxiosResponse<{
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
}, any>>;
