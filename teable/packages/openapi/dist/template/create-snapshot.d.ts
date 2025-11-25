import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const CREATE_SNAPSHOT = "/template/{templateId}/snapshot";
export declare const CreateTemplateSnapshotRoute: RouteConfig;
export declare const createTemplateSnapshot: (templateId: string) => Promise<import("axios").AxiosResponse<void, any>>;
