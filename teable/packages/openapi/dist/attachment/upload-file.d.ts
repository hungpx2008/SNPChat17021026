/// <reference types="node" />
/// <reference types="node" />
import type { ReadStream } from 'fs';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const UPLOAD_FILE_URL = "/attachments/upload/{token}";
export declare const UploadFileRoute: RouteConfig;
export declare const uploadFile: (token: string, data: Buffer | ReadStream, header: Record<string, unknown>, shareId?: string) => Promise<import("axios").AxiosResponse<any, any>>;
